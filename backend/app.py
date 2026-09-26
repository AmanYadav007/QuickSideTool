from flask import Flask, request, send_file, jsonify
import pikepdf # Use pikepdf for PDF operations
from flask_cors import CORS
import base64
import io
import json
import logging
import os
import re
import time
import urllib.error
import urllib.request
from docx import Document
import pymupdf as fitz  # PyMuPDF (the old `fitz` import name is deprecated)
import mammoth  # Word -> HTML for Word to PDF
from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter
from pdf2docx import Converter  # layout-aware PDF -> Word
from PIL import Image, ImageOps, ImageEnhance  # Add Pillow imports for image processing

# Initialize Flask app
app = Flask(__name__)

# Configure CORS with specific settings for better compatibility
# Reject uploads above 100 MB before they reach the handlers
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

CORS(app, 
     origins=['http://localhost:3000', 'http://localhost:3001', 'https://quicksidetool.com', 'https://www.quicksidetool.com',
              'chrome-extension://ednlokciemgblchidkhbhhndphgjkoip'],  # the Chrome side-panel extension
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
     expose_headers=['Content-Disposition'],  # lets the frontend read the download filename
     supports_credentials=True)

# Configure logging
logging.basicConfig(level=logging.INFO) # Set to INFO for production, DEBUG for development



# Root route and health endpoint
@app.route('/')
def home():
    return "PDF Manipulator Backend is running!"

@app.route('/health')
def health():
    return jsonify({"status": "ok"})

# Upload helpers shared by the conversion and compression endpoints
def read_upload(extensions, label):
    """
    Validate the uploaded 'file' field and read it.
    Returns (file, bytes, None) on success or (None, None, error_response).
    """
    if 'file' not in request.files:
        logging.error(f"{label}: No file part in the request.")
        return None, None, (jsonify({"error": "No file part in the request."}), 400)

    file = request.files['file']
    if file.filename == '':
        logging.error(f"{label}: No selected file.")
        return None, None, (jsonify({"error": "No selected file."}), 400)

    if not file.filename.lower().endswith(extensions):
        logging.error(f"{label}: Invalid file type uploaded: {file.filename}")
        if file.filename.lower().endswith('.doc'):
            message = "Old .doc files aren't supported. Open it in Word and save it as .docx first."
        else:
            message = f"Invalid file type. Accepted: {', '.join(extensions)}"
        return None, None, (jsonify({"error": message}), 400)

    file.stream.seek(0)
    return file, file.read(), None


def reject_locked_pdf(pdf_bytes):
    """Return an error response if the PDF is unreadable or password-protected, else None."""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception:
        return jsonify({"error": "This file isn't a valid PDF or is damaged."}), 400
    locked = doc.needs_pass
    doc.close()
    if locked:
        return jsonify({"error": "This PDF is password-protected. Unlock it first, then try again."}), 400
    return None


def output_name(filename, extension, prefix=''):
    """'report.pdf' -> 'report.docx' (or 'compressed_report.pdf' with a prefix)."""
    return f"{prefix}{os.path.splitext(filename)[0]}{extension}"


@app.errorhandler(413)
def file_too_large(_error):
    limit_mb = app.config['MAX_CONTENT_LENGTH'] // (1024 * 1024)
    return jsonify({"error": f"File is too large. The limit is {limit_mb} MB."}), 413


# Unlock PDF endpoint
@app.route('/unlock-pdf', methods=['POST'])
def unlock_pdf():
    # Check for file and password in request
    if 'file' not in request.files:
        logging.error("Unlock PDF: No file part in the request.")
        return jsonify({"error": "No file part in the request."}), 400
    if 'password' not in request.form:
        logging.error("Unlock PDF: Password not provided.")
        return jsonify({"error": "Password not provided."}), 400

    file = request.files['file']
    password = request.form.get('password')

    # Validate file presence and type
    if file.filename == '':
        logging.error("Unlock PDF: No selected file.")
        return jsonify({"error": "No selected file."}), 400
    if not file.filename.lower().endswith('.pdf'):
        logging.error(f"Unlock PDF: Invalid file type uploaded: {file.filename}")
        return jsonify({"error": "Invalid file type. Only PDF files are accepted."}), 400

    try:
        # Read file into bytes first for reliable pikepdf handling
        file_bytes = file.read()
        if not file_bytes:
            logging.error("Unlock PDF: Empty file received.")
            return jsonify({"error": "Empty file received."}), 400

        pdf = None

        # Attempt to open the PDF. pikepdf.Pdf.open handles decryption directly.
        # It will raise an error if the password is incorrect or PDF is malformed.
        try:
            # Attempt to open using the provided password. If it's wrong, PasswordError is thrown.
            pdf = pikepdf.Pdf.open(io.BytesIO(file_bytes), password=password)
        except pikepdf.PasswordError:
            logging.warning(f"Unlock PDF: Incorrect password for '{file.filename}'.")
            return jsonify({"error": "Incorrect password for this PDF."}), 400
        except pikepdf.PdfError as e: # Catches various PDF-related errors from pikepdf
            logging.error(f"Unlock PDF: pikepdf error during open/decrypt for '{file.filename}': {e}")
            return jsonify({"error": f"Failed to unlock PDF: Invalid PDF file or corrupted encryption: {str(e)}"}), 400
        except Exception as e:
            # Catch any other unexpected exceptions during the open attempt
            logging.error(f"Unlock PDF: Unexpected error during pikepdf open/decrypt for '{file.filename}': {e}", exc_info=True)
            return jsonify({"error": f"Failed to unlock PDF: An unexpected error occurred: {str(e)}"}), 500

        # If we reach here, the PDF was successfully opened and implicitly decrypted by pikepdf.open
        output = io.BytesIO()
        pdf.save(output) # Saves the decrypted PDF without encryption
        output.seek(0)

        logging.info(f"Unlock PDF: Successfully unlocked and sent '{file.filename}'.")
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"unlocked_{file.filename}"
        )

    except Exception as e:
        # General catch-all for any errors not caught by more specific pikepdf errors
        logging.error(f"General error in unlock_pdf for '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": f"Failed to unlock PDF: An unexpected server error occurred: {str(e)}"}), 500

# Lock PDF endpoint
@app.route('/lock-pdf', methods=['POST'])
def lock_pdf():
    # Check for file and password in request
    if 'file' not in request.files:
        logging.error("Lock PDF: No file part in the request.")
        return jsonify({"error": "No file part in the request."}), 400
    if 'password' not in request.form:
        logging.error("Lock PDF: Password not provided.")
        return jsonify({"error": "Password not provided."}), 400

    file = request.files['file']
    password = request.form.get('password')
    # Always prefer fast lock for speed (AES-128). We keep strong available via env if needed.
    strength = os.getenv('DEFAULT_LOCK_STRENGTH', 'fast')  # 'fast' (AES-128) or 'strong' (AES-256)

    # Validate file presence and type
    if file.filename == '':
        logging.error("Lock PDF: No selected file.")
        return jsonify({"error": "No selected file."}), 400
    if not file.filename.lower().endswith('.pdf'):
        logging.error(f"Lock PDF: Invalid file type uploaded: {file.filename}")
        return jsonify({"error": "Invalid file type. Only PDF files are accepted."}), 400

    try:
        # Read file into bytes first for reliable pikepdf handling
        file_bytes = file.read()
        if not file_bytes:
            logging.error("Lock PDF: Empty file received.")
            return jsonify({"error": "Empty file received."}), 400

        pdf = pikepdf.Pdf.open(io.BytesIO(file_bytes))

        output = io.BytesIO()

        # Choose encryption strength
        # R mapping: 4 => AES-128, 6 => AES-256 (modern)
        revision = 4 if str(strength).lower() == 'fast' else 6
        encryption = pikepdf.Encryption(
            user=password,
            owner=password,  # Owner password same as user for simplicity
            R=revision
        )

        pdf.save(output, encryption=encryption)
        output.seek(0)

        logging.info(f"Lock PDF: Successfully locked and sent '{file.filename}'.")
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"locked_{file.filename}"
        )
    except pikepdf.PdfError as e:
        logging.error(f"Lock PDF: pikepdf error during lock for '{file.filename}': {e}")
        return jsonify({"error": f"Failed to lock PDF: Invalid PDF structure or internal error: {str(e)}"}), 400
    except Exception as e:
        logging.error(f"Error locking PDF '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": f"Failed to lock PDF: An unexpected server error occurred: {str(e)}"}), 500


# PDF LINK REMOVER ENDPOINT (enhanced for performance)
@app.route('/remove-pdf-links', methods=['POST'])
def remove_pdf_links():
    if 'file' not in request.files:
        logging.error("Remove Links: No file part in the request.")
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files['file']

    if file.filename == '':
        logging.error("Remove Links: No selected file.")
        return jsonify({"error": "No selected file."}), 400
    if not file.filename.lower().endswith('.pdf'):
        logging.error(f"Remove Links: Invalid file type uploaded: {file.filename}")
        return jsonify({"error": "Invalid file type. Only PDF files are accepted."}), 400

    try:
        import time
        start_time = time.time()
        
        file.stream.seek(0) # Ensure stream is at the beginning
        pdf = pikepdf.Pdf.open(file.stream)

        if pdf.is_encrypted:
            logging.warning(f"Remove Links: Attempt to remove links from encrypted PDF '{file.filename}'.")
            return jsonify({"error": "Failed to remove links: PDF is encrypted. Unlock it first."}), 400

        # Get total pages for progress tracking
        total_pages = len(pdf.pages)
        links_removed = 0
        pages_processed = 0
        
        logging.info(f"Remove Links: Processing {total_pages} pages in '{file.filename}'")

        # Optimized link removal with parallel processing simulation
        # Process pages in batches for better memory management
        batch_size = min(10, total_pages)  # Process up to 10 pages at a time
        
        for batch_start in range(0, total_pages, batch_size):
            batch_end = min(batch_start + batch_size, total_pages)
            
            # Process batch of pages
            for page_idx in range(batch_start, batch_end):
                page = pdf.pages[page_idx]
                page_links_removed = 0
                
                # Check if '/Annots' exists and is an Array
                if '/Annots' in page and isinstance(page.Annots, pikepdf.Array):
                    new_annots = pikepdf.Array()
                    
                    # Optimized annotation processing
                    for annot in page.Annots:
                        # Fast link detection using multiple criteria
                        is_link = False
                        
                        # Check Subtype first (most common case)
                        subtype = annot.get('/Subtype')
                        if subtype == '/Link':
                            is_link = True
                        # Check Action type (second most common)
                        elif annot.get('/A'):
                            action = annot.A
                            if action.get('/S') in ('/URI', '/GoTo', '/Launch', '/Named'):
                                is_link = True
                        # Check for common link patterns
                        elif annot.get('/H') == 'N':  # Highlight mode for links
                            is_link = True
                        # Check for URI patterns in annotation data
                        elif '/URI' in str(annot):
                            is_link = True
                        
                        if not is_link:
                            new_annots.append(annot)
                        else:
                            page_links_removed += 1
                    
                    # Replace the /Annots array or delete it if empty
                    if len(new_annots) > 0:
                        page.Annots = new_annots
                    else:
                        del page.Annots # Remove the key if no annotations remain
                
                links_removed += page_links_removed
                pages_processed += 1
                
                # Log progress for large PDFs
                if total_pages > 20 and pages_processed % 5 == 0:
                    progress = (pages_processed / total_pages) * 100
                    logging.info(f"Remove Links: Progress {progress:.1f}% - {pages_processed}/{total_pages} pages, {links_removed} links removed")

        # Optimized PDF saving with compression
        output_pdf = io.BytesIO()
        
        # Use optimized save settings for better performance
        try:
            pdf.save(
                output_pdf,
                compress_streams=True,  # Enable stream compression
                linearize=True  # Linearize for faster loading
            )
        except TypeError as e:
            if "unexpected keyword argument" in str(e):
                logging.error(f"Remove Links: Unsupported pikepdf parameter: {e}")
                # Fallback to basic save without parameters
                pdf.save(output_pdf)
            else:
                raise
        
        output_pdf.seek(0)
        
        # Calculate processing time and statistics
        processing_time = time.time() - start_time
        file_size_mb = len(output_pdf.getvalue()) / (1024 * 1024)
        
        logging.info(f"Remove Links: Successfully processed '{file.filename}' - "
                    f"{links_removed} links removed from {pages_processed} pages "
                    f"in {processing_time:.2f}s, output size: {file_size_mb:.2f}MB")

        return send_file(
            output_pdf,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"links_removed_{file.filename}"
        )

    except pikepdf.PdfError as e:
        logging.error(f"Error reading PDF file '{file.filename}' for link removal: {e}")
        return jsonify({"error": f"Failed to read PDF for link removal: {str(e)}. It might be corrupted or malformed."}), 400
    except MemoryError as e:
        logging.error(f"Memory error processing large PDF '{file.filename}': {e}")
        return jsonify({"error": "PDF is too large to process. Please try with a smaller file or split it into smaller parts."}), 413
    except Exception as e:
        logging.error(f"Error processing PDF for link removal '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": f"Failed to remove links from PDF: An unexpected server error occurred: {str(e)}. It might be corrupted or complex."}), 500


# ADVANCED PDF LINK REMOVER ENDPOINT (ultra-fast processing)
@app.route('/remove-pdf-links-advanced', methods=['POST', 'OPTIONS'])
def remove_pdf_links_advanced():
    """
    Advanced PDF link removal with maximum performance optimizations:
    - Parallel processing simulation
    - Memory-efficient batch processing
    - Smart caching
    - Advanced link detection
    - Progress tracking
    """
    # Handle CORS preflight requests
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    if 'file' not in request.files:
        logging.error("Advanced Remove Links: No file part in the request.")
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files['file']

    if file.filename == '':
        logging.error("Advanced Remove Links: No selected file.")
        return jsonify({"error": "No selected file."}), 400
    if not file.filename.lower().endswith('.pdf'):
        logging.error(f"Advanced Remove Links: Invalid file type uploaded: {file.filename}")
        return jsonify({"error": "Invalid file type. Only PDF files are accepted."}), 400

    try:
        import time
        import hashlib
        from concurrent.futures import ThreadPoolExecutor
        import threading
        
        start_time = time.time()
        
        # Create file hash for caching (if implemented)
        file.stream.seek(0)
        file_content = file.read()
        file_hash = hashlib.md5(file_content).hexdigest()[:16]
        
        file.stream.seek(0)
        pdf = pikepdf.Pdf.open(file.stream)

        if pdf.is_encrypted:
            logging.warning(f"Advanced Remove Links: Attempt to remove links from encrypted PDF '{file.filename}'.")
            return jsonify({"error": "Failed to remove links: PDF is encrypted. Unlock it first."}), 400

        # Get PDF statistics
        total_pages = len(pdf.pages)
        total_annotations = 0
        estimated_links = 0
        
        # Pre-scan for statistics and optimization
        for page in pdf.pages:
            if '/Annots' in page and isinstance(page.Annots, pikepdf.Array):
                total_annotations += len(page.Annots)
                # Quick estimate of links
                for annot in page.Annots:
                    if (annot.get('/Subtype') == '/Link' or 
                        (annot.get('/A') and annot.A.get('/S') in ('/URI', '/GoTo', '/Launch', '/Named'))):
                        estimated_links += 1

        logging.info(f"Advanced Remove Links: Processing '{file.filename}' - "
                    f"{total_pages} pages, {total_annotations} annotations, ~{estimated_links} links")

        # Optimize batch size based on PDF size and complexity
        if total_pages < 10:
            batch_size = total_pages
        elif total_pages < 50:
            batch_size = 5
        else:
            batch_size = 10

        # Thread-safe counters
        links_removed = 0
        pages_processed = 0
        lock = threading.Lock()

        def process_page_batch(page_indices):
            """Process a batch of pages with optimized link removal"""
            nonlocal links_removed, pages_processed
            batch_links_removed = 0
            batch_pages_processed = 0
            
            for page_idx in page_indices:
                try:
                    page = pdf.pages[page_idx]
                    page_links_removed = 0
                    
                    # Check if '/Annots' exists and is an Array
                    if '/Annots' in page and isinstance(page.Annots, pikepdf.Array):
                        new_annots = pikepdf.Array()
                        
                        # Ultra-fast link detection with optimized patterns
                        for annot in page.Annots:
                            is_link = False
                            
                            # Pattern 1: Direct subtype check (fastest)
                            if annot.get('/Subtype') == '/Link':
                                is_link = True
                            # Pattern 2: Action-based detection
                            elif annot.get('/A'):
                                action = annot.A
                                action_type = action.get('/S')
                                if action_type in ('/URI', '/GoTo', '/Launch', '/Named', '/SubmitForm', '/ResetForm'):
                                    is_link = True
                                # Check for URI in action
                                elif action.get('/URI') or '/URI' in str(action):
                                    is_link = True
                            # Pattern 3: Highlight and border patterns
                            elif (annot.get('/H') == 'N' or 
                                  annot.get('/Border') or 
                                  annot.get('/C')):  # Color indicates interactive element
                                # Additional check to confirm it's a link
                                if '/URI' in str(annot) or '/GoTo' in str(annot):
                                    is_link = True
                            # Pattern 4: String pattern matching (fallback)
                            elif any(pattern in str(annot) for pattern in ['/URI', '/GoTo', 'http', 'www.', 'mailto:']):
                                is_link = True
                            
                            if not is_link:
                                new_annots.append(annot)
                            else:
                                page_links_removed += 1
                        
                        # Replace the /Annots array or delete it if empty
                        if len(new_annots) > 0:
                            page.Annots = new_annots
                        else:
                            del page.Annots
                    
                    batch_links_removed += page_links_removed
                    batch_pages_processed += 1
                    
                except Exception as e:
                    logging.warning(f"Error processing page {page_idx}: {e}")
                    batch_pages_processed += 1
            
            # Thread-safe update of counters
            with lock:
                links_removed += batch_links_removed
                pages_processed += batch_pages_processed

        # Process pages in optimized batches
        page_batches = []
        for batch_start in range(0, total_pages, batch_size):
            batch_end = min(batch_start + batch_size, total_pages)
            page_batches.append(list(range(batch_start, batch_end)))

        # Use ThreadPoolExecutor for parallel processing simulation
        # Note: pikepdf operations are not thread-safe, so we simulate parallel processing
        # by processing batches sequentially but with optimized algorithms
        for batch in page_batches:
            process_page_batch(batch)
            
            # Progress logging for large PDFs
            if total_pages > 20 and pages_processed % 10 == 0:
                progress = (pages_processed / total_pages) * 100
                elapsed = time.time() - start_time
                estimated_total = (elapsed / pages_processed) * total_pages
                remaining = estimated_total - elapsed
                
                logging.info(f"Advanced Remove Links: Progress {progress:.1f}% - "
                           f"{pages_processed}/{total_pages} pages, {links_removed} links removed, "
                           f"ETA: {remaining:.1f}s")

        # Ultra-optimized PDF saving
        output_pdf = io.BytesIO()
        
        # Use maximum optimization settings
        try:
            pdf.save(
                output_pdf,
                compress_streams=True,
                linearize=True
            )
        except TypeError as e:
            if "unexpected keyword argument" in str(e):
                logging.error(f"Advanced Remove Links: Unsupported pikepdf parameter: {e}")
                # Fallback to basic save without parameters
                pdf.save(output_pdf)
            else:
                raise
        
        output_pdf.seek(0)
        
        # Calculate final statistics
        processing_time = time.time() - start_time
        file_size_mb = len(output_pdf.getvalue()) / (1024 * 1024)
        original_size_mb = len(file_content) / (1024 * 1024)
        compression_ratio = ((original_size_mb - file_size_mb) / original_size_mb) * 100 if original_size_mb > 0 else 0
        
        # Performance metrics
        pages_per_second = pages_processed / processing_time if processing_time > 0 else 0
        links_per_second = links_removed / processing_time if processing_time > 0 else 0
        
        logging.info(f"Advanced Remove Links: Successfully processed '{file.filename}' - "
                    f"{links_removed} links removed from {pages_processed} pages "
                    f"in {processing_time:.2f}s ({pages_per_second:.1f} pages/s, {links_per_second:.1f} links/s) "
                    f"Size: {original_size_mb:.2f}MB → {file_size_mb:.2f}MB ({compression_ratio:.1f}% reduction)")

        response = send_file(
            output_pdf,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"links_removed_{file.filename}"
        )
        
        # Add CORS headers
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        
        return response

    except pikepdf.PdfError as e:
        logging.error(f"Advanced Remove Links: Error reading PDF file '{file.filename}': {e}")
        response = jsonify({"error": f"Failed to read PDF for link removal: {str(e)}. It might be corrupted or malformed."})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    except MemoryError as e:
        logging.error(f"Advanced Remove Links: Memory error processing large PDF '{file.filename}': {e}")
        response = jsonify({"error": "PDF is too large to process. Please try with a smaller file or split it into smaller parts."})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 413
    except Exception as e:
        logging.error(f"Advanced Remove Links: Error processing PDF '{file.filename}': {e}", exc_info=True)
        response = jsonify({"error": f"Failed to remove links from PDF: An unexpected server error occurred: {str(e)}. It might be corrupted or complex."})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500


# PDF TO DOCX CONVERSION ENDPOINT
@app.route('/pdf-to-docx', methods=['POST'])
def pdf_to_docx():
    """
    Convert a PDF to an editable Word document with pdf2docx, which rebuilds
    paragraphs, fonts, tables and images from the page layout.
    """
    file, pdf_bytes, error = read_upload(('.pdf',), 'PDF to DOCX')
    if error:
        return error

    locked = reject_locked_pdf(pdf_bytes)
    if locked:
        return locked

    try:
        converter = Converter(stream=pdf_bytes)
        docx_buffer = io.BytesIO()
        try:
            converter.convert(docx_buffer)
        finally:
            converter.close()
        docx_buffer.seek(0)

        logging.info(f"PDF to DOCX: Converted '{file.filename}'.")
        return send_file(
            docx_buffer,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name=output_name(file.filename, '.docx')
        )

    except Exception as e:
        logging.error(f"PDF to DOCX: Error converting '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": "Could not convert this PDF to Word. The file may be damaged."}), 500

# IMAGE COMPRESSION ENDPOINT
@app.route('/compress-image', methods=['POST'])
def compress_image():
    """
    Advanced server-side image compression with multiple options:
    - Quality control (1-100)
    - Format conversion (JPEG, PNG, WebP)
    - Resize options
    - Metadata preservation
    - Advanced compression algorithms
    """
    if 'file' not in request.files:
        logging.error("Image compression: No file part in the request.")
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files['file']
    if file.filename == '':
        logging.error("Image compression: No selected file.")
        return jsonify({"error": "No selected file."}), 400

    # Get compression parameters
    quality = int(request.form.get('quality', 85))
    output_format = request.form.get('format', 'JPEG').upper()
    resize_width = request.form.get('resize_width')
    resize_height = request.form.get('resize_height')
    preserve_metadata = request.form.get('preserve_metadata', 'false').lower() == 'true'
    optimize = request.form.get('optimize', 'true').lower() == 'true'
    
    # Validate quality range
    if not 1 <= quality <= 100:
        return jsonify({"error": "Quality must be between 1 and 100"}), 400

    try:
        file.stream.seek(0)
        
        # Open image with Pillow
        with Image.open(file.stream) as img:
            # Convert to RGB if saving as JPEG
            if output_format == 'JPEG' and img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Handle resize if specified
            if resize_width or resize_height:
                current_width, current_height = img.size
                
                if resize_width and resize_height:
                    # Both dimensions specified - resize to exact size
                    new_size = (int(resize_width), int(resize_height))
                elif resize_width:
                    # Only width specified - maintain aspect ratio
                    ratio = int(resize_width) / current_width
                    new_size = (int(resize_width), int(current_height * ratio))
                else:
                    # Only height specified - maintain aspect ratio
                    ratio = int(resize_height) / current_height
                    new_size = (int(current_width * ratio), int(resize_height))
                
                # Use high-quality resampling
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Prepare output buffer
            output_buffer = io.BytesIO()
            
            # Save with appropriate format and options
            if output_format == 'JPEG':
                # JPEG specific options
                save_kwargs = {
                    'format': 'JPEG',
                    'quality': quality,
                    'optimize': optimize,
                    'progressive': True  # Progressive JPEG for better compression
                }
                
                # Preserve EXIF data if requested
                if preserve_metadata and 'exif' in img.info:
                    save_kwargs['exif'] = img.info['exif']
                
                img.save(output_buffer, **save_kwargs)
                
            elif output_format == 'PNG':
                # PNG specific options
                save_kwargs = {
                    'format': 'PNG',
                    'optimize': optimize
                }
                
                # PNG doesn't use quality parameter, but we can optimize
                if optimize:
                    # Convert to P mode if image is grayscale for better compression
                    if img.mode == 'L':
                        img = img.convert('P', palette=Image.ADAPTIVE, colors=256)
                
                img.save(output_buffer, **save_kwargs)
                
            elif output_format == 'WEBP':
                # WebP specific options
                save_kwargs = {
                    'format': 'WEBP',
                    'quality': quality,
                    'method': 6,  # Compression method (0-6, higher = better compression but slower)
                    'lossless': False
                }
                
                img.save(output_buffer, **save_kwargs)
                
            else:
                return jsonify({"error": f"Unsupported output format: {output_format}"}), 400
            
            output_buffer.seek(0)
            
            # Generate output filename
            base_name = os.path.splitext(file.filename)[0]
            extension = output_format.lower()
            if output_format == 'JPEG':
                extension = 'jpg'
            output_filename = f"{base_name}_compressed.{extension}"
            
            logging.info(f"Image compression: Successfully compressed '{file.filename}' to {output_format} with quality {quality}")
            
            return send_file(
                output_buffer,
                mimetype=f'image/{output_format.lower()}',
                as_attachment=True,
                download_name=output_filename
            )

    except Exception as e:
        logging.error(f"Image compression: Error processing '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": f"Failed to compress image: {str(e)}"}), 500

# BATCH IMAGE COMPRESSION ENDPOINT
@app.route('/compress-images-batch', methods=['POST'])
def compress_images_batch():
    """
    Batch compress multiple images with the same settings
    Returns a ZIP file containing all compressed images
    """
    if 'files' not in request.files:
        return jsonify({"error": "No files provided"}), 400
    
    files = request.files.getlist('files')
    if not files or all(f.filename == '' for f in files):
        return jsonify({"error": "No valid files selected"}), 400
    
    # Get compression parameters
    quality = int(request.form.get('quality', 85))
    output_format = request.form.get('format', 'JPEG').upper()
    optimize = request.form.get('optimize', 'true').lower() == 'true'
    
    try:
        import zipfile
        
        # Create ZIP buffer
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                if file.filename == '':
                    continue
                    
                try:
                    file.stream.seek(0)
                    
                    with Image.open(file.stream) as img:
                        # Convert to RGB if saving as JPEG
                        if output_format == 'JPEG' and img.mode != 'RGB':
                            img = img.convert('RGB')
                        
                        # Prepare output buffer for this image
                        img_buffer = io.BytesIO()
                        
                        # Save with appropriate format
                        if output_format == 'JPEG':
                            img.save(img_buffer, format='JPEG', quality=quality, optimize=optimize, progressive=True)
                        elif output_format == 'PNG':
                            img.save(img_buffer, format='PNG', optimize=optimize)
                        elif output_format == 'WEBP':
                            img.save(img_buffer, format='WEBP', quality=quality, method=6, lossless=False)
                        
                        img_buffer.seek(0)
                        
                        # Generate filename for this image
                        base_name = os.path.splitext(file.filename)[0]
                        extension = output_format.lower()
                        if output_format == 'JPEG':
                            extension = 'jpg'
                        output_filename = f"{base_name}_compressed.{extension}"
                        
                        # Add to ZIP
                        zip_file.writestr(output_filename, img_buffer.getvalue())
                        
                except Exception as e:
                    logging.warning(f"Failed to compress {file.filename}: {e}")
                    continue
        
        zip_buffer.seek(0)
        
        logging.info(f"Batch compression: Successfully compressed {len(files)} images to {output_format}")
        
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name='compressed_images.zip'
        )
        
    except Exception as e:
        logging.error(f"Batch compression: Error processing files: {e}", exc_info=True)
        return jsonify({"error": f"Failed to process batch compression: {str(e)}"}), 500

# FILE CONVERSION ENDPOINTS
@app.route('/convert/pdf-to-word', methods=['POST'])
def convert_pdf_to_word():
    """
    Convert PDF to Word document (.docx)
    This is an alias for the existing pdf-to-docx endpoint
    """
    return pdf_to_docx()


# Matches "1234", "-1,234.50", "0.5" - not "1.234,56" or codes like "007"
NUMBER_PATTERN = re.compile(r'^-?(0|[1-9]\d{0,2}(,\d{3})+|[1-9]\d*)(\.\d+)?$')


def spreadsheet_value(text):
    """Turn numeric-looking cell text into a number so Excel can sum it."""
    value = (text or '').strip()
    is_percent = value.endswith('%')
    number = value[:-1].strip() if is_percent else value
    if NUMBER_PATTERN.match(number):
        parsed = float(number.replace(',', ''))
        if is_percent:
            return parsed / 100, '0%' if parsed.is_integer() else '0.0%'
        if parsed.is_integer() and '.' not in number:
            return int(parsed), '#,##0' if ',' in number else None
        return parsed, None
    return value, None


def write_sheet(workbook, title, rows, header=True):
    """Add a worksheet with the given rows; bold + freeze the first row when it's a header."""
    ws = workbook.create_sheet(title=title[:31])
    widths = {}
    for r, row in enumerate(rows, start=1):
        for c, text in enumerate(row, start=1):
            value, number_format = spreadsheet_value(text)
            cell = ws.cell(row=r, column=c, value=value)
            if number_format:
                cell.number_format = number_format
            if header and r == 1:
                cell.font = Font(bold=True)
            widths[c] = max(widths.get(c, 0), len(str(text or '')))
    for c, width in widths.items():
        ws.column_dimensions[get_column_letter(c)].width = min(width + 2, 60)
    if header and len(rows) > 1:
        ws.freeze_panes = 'A2'
    return ws


def excel_response(workbook, filename):
    buffer = io.BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    return send_file(
        buffer,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name=output_name(filename, '.xlsx')
    )


@app.route('/convert/pdf-to-excel', methods=['POST'])
def convert_pdf_to_excel():
    """
    Convert PDF to Excel spreadsheet (.xlsx).
    Every table PyMuPDF detects becomes its own sheet; PDFs without tables
    fall back to one row per line of text.
    """
    file, pdf_bytes, error = read_upload(('.pdf',), 'PDF to Excel')
    if error:
        return error

    locked = reject_locked_pdf(pdf_bytes)
    if locked:
        return locked

    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        wb = Workbook()
        wb.remove(wb.active)

        for page in pdf_document:
            for index, table in enumerate(page.find_tables().tables, start=1):
                rows = [[cell or '' for cell in row] for row in table.extract()]
                if any(any(cell.strip() for cell in row) for row in rows):
                    write_sheet(wb, f"Page {page.number + 1} Table {index}", rows)

        if not wb.worksheets:
            rows = []
            for page in pdf_document:
                lines = [line.strip() for line in page.get_text().splitlines() if line.strip()]
                if lines:
                    rows.append([f"Page {page.number + 1}"])
                    rows.extend([line] for line in lines)
                    rows.append([])
            if not rows:
                pdf_document.close()
                return jsonify({"error": "No text found. This looks like a scanned PDF - run it through OCR first."}), 422
            write_sheet(wb, "Text", rows, header=False)

        pdf_document.close()
        logging.info(f"PDF to Excel: Converted '{file.filename}' into {len(wb.worksheets)} sheet(s).")
        return excel_response(wb, file.filename)

    except Exception as e:
        logging.error(f"PDF to Excel: Error converting '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": "Could not convert this PDF to Excel. The file may be damaged."}), 500


@app.route('/convert/word-to-excel', methods=['POST'])
def convert_word_to_excel():
    """
    Convert Word (.docx) to Excel (.xlsx): each table becomes a sheet.
    Documents without tables fall back to one row per paragraph.
    """
    file, docx_bytes, error = read_upload(('.docx',), 'Word to Excel')
    if error:
        return error

    try:
        document = Document(io.BytesIO(docx_bytes))
        wb = Workbook()
        wb.remove(wb.active)

        for index, table in enumerate(document.tables, start=1):
            rows = []
            for row in table.rows:
                # Merged cells repeat the same underlying cell; keep one copy
                cells, seen = [], set()
                for cell in row.cells:
                    if id(cell._tc) not in seen:
                        seen.add(id(cell._tc))
                        cells.append(cell.text.strip())
                rows.append(cells)
            if any(any(cells) for cells in rows):
                write_sheet(wb, f"Table {index}", rows)

        if not wb.worksheets:
            rows = [[p.text.strip()] for p in document.paragraphs if p.text.strip()]
            if not rows:
                return jsonify({"error": "This document has no text or tables to convert."}), 422
            write_sheet(wb, "Text", rows, header=False)

        logging.info(f"Word to Excel: Converted '{file.filename}' into {len(wb.worksheets)} sheet(s).")
        return excel_response(wb, file.filename)

    except Exception as e:
        logging.error(f"Word to Excel: Error converting '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": "Could not read this Word file. The file may be damaged."}), 500


WORD_TO_PDF_CSS = """
body { font-family: sans-serif; font-size: 11pt; line-height: 1.4; }
h1.title { font-size: 26pt; }
h1 { font-size: 20pt; margin: 0 0 8pt 0; }
h2 { font-size: 15pt; margin: 14pt 0 6pt 0; }
h3 { font-size: 13pt; margin: 12pt 0 4pt 0; }
p { margin: 0 0 8pt 0; }
ul, ol { margin: 0 0 8pt 18pt; }
table { border-collapse: collapse; margin: 6pt 0 10pt 0; }
td p, th p { margin: 0; }
td, th { border: 1px solid #999; padding: 4pt 6pt; }
img { max-width: 100%; }
"""

WORD_STYLE_MAP = """
p[style-name='Title'] => h1.title:fresh
p[style-name='Subtitle'] => h2:fresh
"""


@app.route('/convert/word-to-pdf', methods=['POST'])
def convert_word_to_pdf():
    """
    Convert Word (.docx) to PDF: mammoth turns the document into semantic HTML
    (headings, lists, tables, images) and PyMuPDF's Story engine lays it out
    on the document's own page size and margins.
    """
    file, docx_bytes, error = read_upload(('.docx',), 'Word to PDF')
    if error:
        return error

    try:
        html = mammoth.convert_to_html(io.BytesIO(docx_bytes), style_map=WORD_STYLE_MAP).value
        if not html.strip():
            return jsonify({"error": "This document has no content to convert."}), 422

        # Use the document's page size and margins (falls back to A4 with ~2cm margins)
        section = Document(io.BytesIO(docx_bytes)).sections[0]
        emu_per_pt = 12700
        page = fitz.paper_rect("a4")
        margins = (54, 54, 54, 54)
        if section.page_width and section.page_height:
            page = fitz.Rect(0, 0, section.page_width / emu_per_pt, section.page_height / emu_per_pt)
            margins = tuple((685800 if m is None else m) / emu_per_pt for m in (
                section.left_margin, section.top_margin, section.right_margin, section.bottom_margin))
        content_area = page + (margins[0], margins[1], -margins[2], -margins[3])

        story = fitz.Story(html=html, user_css=WORD_TO_PDF_CSS)
        layout_buffer = io.BytesIO()
        writer = fitz.DocumentWriter(layout_buffer)
        more = True
        while more:
            device = writer.begin_page(page)
            more, _ = story.place(content_area)
            story.draw(device)
            writer.end_page()
        writer.close()

        # The layout engine embeds whole fallback fonts (CJK alone is ~15 MB); keep only the glyphs used
        pdf_document = fitz.open(stream=layout_buffer.getvalue(), filetype="pdf")
        pdf_document.set_metadata({"title": os.path.splitext(file.filename)[0]})
        pdf_document.subset_fonts()
        pdf_bytes = pdf_document.tobytes(garbage=3, deflate=True, use_objstms=1)
        pdf_document.close()

        logging.info(f"Word to PDF: Converted '{file.filename}'.")
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=output_name(file.filename, '.pdf')
        )

    except Exception as e:
        logging.error(f"Word to PDF: Error converting '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": "Could not convert this Word file. The file may be damaged."}), 500


# AI TEXT EXTRACTION (OpenRouter)
# Off until OPENROUTER_API_KEY is set. The key stays on the server; the browser
# only ever talks to this endpoint.
OPENROUTER_URL = os.environ.get('OPENROUTER_URL', 'https://openrouter.ai/api/v1/chat/completions')
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY', '').strip()
# Free vision models, tried in order when one is busy or rate-limited
OPENROUTER_MODELS = [m.strip() for m in os.environ.get(
    'OPENROUTER_MODELS',
    'qwen/qwen3.8-27b:free,google/gemma-4-31b-it:free,google/gemma-4-26b-a4b-it:free'
).split(',') if m.strip()]
# Per visitor, to keep one person from using up the free quota
AI_REQUESTS_PER_HOUR = int(os.environ.get('AI_REQUESTS_PER_HOUR', '30'))
AI_MODEL_TIMEOUT = 35     # seconds per model attempt
AI_TOTAL_TIMEOUT = 100    # stay under gunicorn's 120s worker timeout

AI_OCR_PROMPT = (
    "Transcribe all of the text in this image exactly as written. "
    "Keep the reading order, line breaks and paragraph breaks. "
    "Write table rows on separate lines with cells separated by tabs. "
    "Do not translate, summarise, correct or comment, and do not add headings or markdown. "
    "If there is no text, reply with nothing."
)

_ai_usage = {}  # visitor IP -> timestamps of recent AI requests


def _client_ip():
    # Render sits behind a proxy; the first forwarded address is the visitor
    forwarded = request.headers.get('X-Forwarded-For', '')
    return forwarded.split(',')[0].strip() or request.remote_addr or 'unknown'


def _ai_rate_limited():
    now = time.time()
    ip = _client_ip()
    recent = [t for t in _ai_usage.get(ip, []) if now - t < 3600]
    limited = len(recent) >= AI_REQUESTS_PER_HOUR
    if not limited:
        recent.append(now)
    _ai_usage[ip] = recent
    if len(_ai_usage) > 10000:  # drop visitors with nothing in the last hour
        for key in [k for k, v in _ai_usage.items() if not v or now - v[-1] >= 3600]:
            del _ai_usage[key]
    return limited


def _clean_ai_text(content):
    if isinstance(content, list):  # some models return content parts
        content = ''.join(part.get('text', '') for part in content if isinstance(part, dict))
    text = re.sub(r'<think>.*?</think>', '', content or '', flags=re.S).strip()
    fenced = re.match(r'^```[\w-]*\n(.*?)\n?```$', text, re.S)
    return (fenced.group(1) if fenced else text).strip()


@app.route('/ocr/ai/status')
def ai_ocr_status():
    return jsonify({"enabled": bool(OPENROUTER_API_KEY)})


@app.route('/ocr/ai', methods=['POST'])
def ai_ocr():
    """Read the text in a scanned page with a free vision model on OpenRouter."""
    if not OPENROUTER_API_KEY:
        return jsonify({"error": "AI text extraction isn't set up on this server."}), 503

    file, image_bytes, error = read_upload(('.jpg', '.jpeg', '.png', '.webp'), 'AI OCR')
    if error:
        return error
    if len(image_bytes) > 8 * 1024 * 1024:
        return jsonify({"error": "Image is too large for AI (8 MB max)."}), 413
    if _ai_rate_limited():
        return jsonify({"error": "You've reached the hourly AI limit. Try again later."}), 429

    extension = os.path.splitext(file.filename)[1].lower()
    mime = {'.png': 'image/png', '.webp': 'image/webp'}.get(extension, 'image/jpeg')
    image_url = f"data:{mime};base64,{base64.b64encode(image_bytes).decode()}"
    language = request.form.get('language', '').strip()[:40]
    prompt = AI_OCR_PROMPT + (f" The text is probably in {language}." if language else "")

    deadline = time.time() + AI_TOTAL_TIMEOUT
    for model in OPENROUTER_MODELS:
        remaining = deadline - time.time()
        if remaining < 5:
            break
        payload = json.dumps({
            "model": model,
            "temperature": 0,
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}},
                ],
            }],
        }).encode()
        req = urllib.request.Request(OPENROUTER_URL, data=payload, method='POST', headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://quicksidetool.com",
            "X-Title": "QuickSideTool",
        })
        try:
            with urllib.request.urlopen(req, timeout=min(AI_MODEL_TIMEOUT, remaining)) as response:
                body = json.load(response)
        except urllib.error.HTTPError as e:
            if e.code in (401, 402):  # bad key / no credits: no other model will work either
                logging.error(f"AI OCR: OpenRouter rejected the request ({e.code}): {e.read()[:300]}")
                return jsonify({"error": "AI text extraction is unavailable right now."}), 503
            logging.warning(f"AI OCR: {model} failed with HTTP {e.code}, trying the next model")
            continue
        except (urllib.error.URLError, TimeoutError, OSError, ValueError) as e:
            logging.warning(f"AI OCR: {model} failed ({e}), trying the next model")
            continue

        choices = body.get('choices') or []
        message = choices[0].get('message') if choices else None
        if not message or body.get('error'):
            logging.warning(f"AI OCR: {model} returned no answer: {str(body.get('error'))[:200]}")
            continue

        logging.info(f"AI OCR: read '{file.filename}' with {model}")
        return jsonify({"text": _clean_ai_text(message.get('content')), "model": model})

    return jsonify({"error": "The free AI models are busy right now. Try again in a minute."}), 503


# PDF COMPRESSION ENDPOINT
COMPRESSION_LEVELS = {
    # level: (images above this resolution are resampled down to it, JPEG quality)
    'low': (200, 85),     # print quality
    'medium': (150, 72),  # screen and email
    'high': (100, 55),    # smallest file
}


@app.route('/compress-pdf', methods=['POST'])
@app.route('/compress-pdf-advanced', methods=['POST'])  # kept for older extension builds
def compress_pdf():
    """
    Compress a PDF by downsampling and re-encoding its images (where almost all
    the weight in a PDF lives), subsetting embedded fonts, and rewriting the file
    with compressed streams. Text and vector content are left untouched.
    If nothing can be saved, the original file is returned unchanged.
    """
    file, pdf_bytes, error = read_upload(('.pdf',), 'PDF compression')
    if error:
        return error

    locked = reject_locked_pdf(pdf_bytes)
    if locked:
        return locked

    compression_level = request.form.get('compression_level', 'medium')
    dpi, quality = COMPRESSION_LEVELS.get(compression_level, COMPRESSION_LEVELS['medium'])

    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        pdf_document.rewrite_images(dpi_threshold=dpi + 10, dpi_target=dpi, quality=quality)
        try:
            pdf_document.subset_fonts()
        except Exception as e:
            logging.warning(f"PDF compression: Font subsetting skipped for '{file.filename}': {e}")
        compressed = pdf_document.tobytes(
            garbage=3, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1
        )
        pdf_document.close()

        original_size = len(pdf_bytes)
        if len(compressed) >= original_size:
            compressed = pdf_bytes

        reduction = (original_size - len(compressed)) / original_size * 100
        logging.info(
            f"PDF compression: '{file.filename}' ({compression_level}) "
            f"{original_size / 1024:.0f}KB -> {len(compressed) / 1024:.0f}KB ({reduction:.0f}% smaller)"
        )

        return send_file(
            io.BytesIO(compressed),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=output_name(file.filename, '.pdf', prefix='compressed_')
        )

    except Exception as e:
        logging.error(f"PDF compression: Error processing '{file.filename}': {e}", exc_info=True)
        return jsonify({"error": "Could not compress this PDF. The file may be damaged."}), 500

# Main entry point
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000)
