import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Image, 
  QrCode, 
  TrendingUp, 
  Calendar, 
  Download, 
  Upload,
  Clock,
  Star,
  Activity,
  Users,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    filesThisMonth: 0,
    storageUsed: 0,
    storageLimit: 100 * 1024 * 1024, // 100MB
    recentFiles: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setStats({
        totalFiles: 156,
        filesThisMonth: 23,
        storageUsed: 45 * 1024 * 1024, // 45MB
        storageLimit: 100 * 1024 * 1024, // 100MB
        recentFiles: [
          { name: 'document.pdf', type: 'pdf', size: '2.3 MB', date: '2024-01-15' },
          { name: 'image.jpg', type: 'image', size: '1.8 MB', date: '2024-01-14' },
          { name: 'qr-code.png', type: 'qr', size: '0.1 MB', date: '2024-01-13' },
          { name: 'presentation.pdf', type: 'pdf', size: '5.2 MB', date: '2024-01-12' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'qr':
        return <QrCode className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const storagePercentage = (stats.storageUsed / stats.storageLimit) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans antialiased relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse top-1/4 left-1/4"></div>
        <div className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse animation-delay-2000 bottom-1/4 right-1/4"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-300">Welcome back! Here's your activity overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Files</p>
                <p className="text-3xl font-bold">{stats.totalFiles}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-3xl font-bold">{stats.filesThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-3xl font-bold">{formatBytes(stats.storageUsed)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Processing Speed</p>
                <p className="text-3xl font-bold">2.3s</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Storage Progress */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Storage Usage</h3>
            <span className="text-sm text-gray-400">
              {formatBytes(stats.storageUsed)} / {formatBytes(stats.storageLimit)}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                storagePercentage > 80 ? 'bg-red-500' : 
                storagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {storagePercentage.toFixed(1)}% used
          </p>
        </div>

        {/* Recent Files */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Files</h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {stats.recentFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">{file.size}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{file.date}</p>
                    <button className="text-purple-400 hover:text-purple-300 text-sm">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105">
                <Upload className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Upload File</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105">
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">PDF Tools</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                <Image className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Image Tools</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
                <QrCode className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">QR Generator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-6">Usage Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">PDF Processing</h4>
              <p className="text-3xl font-bold text-blue-400">89</p>
              <p className="text-sm text-gray-400">files this month</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <Image className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Image Processing</h4>
              <p className="text-3xl font-bold text-green-400">156</p>
              <p className="text-sm text-gray-400">files this month</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <QrCode className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">QR Codes</h4>
              <p className="text-3xl font-bold text-purple-400">23</p>
              <p className="text-sm text-gray-400">generated this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 