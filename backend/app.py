from flask import Flask, request, send_file
from PyPDF2 import PdfReader, PdfWriter
import io
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/unlock-pdf', methods=['POST'])
def unlock_pdf():
    file = request.files['file']
    password = request.form.get('password')

    try:
        reader = PdfReader(file)
        if reader.is_encrypted:
            if not reader.decrypt(password):
                return "Incorrect password", 400

        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        output = io.BytesIO()
        writer.write(output)
        output.seek(0)

        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='unlocked.pdf'
        )
    except Exception as e:
        return str(e), 400

if __name__ == '__main__':
    app.run(debug=True)