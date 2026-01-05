import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import ModernDatePicker from './ModernDatePicker';

const ReportModal = ({ open, activity, onClose, onSubmit }) => {
  const [reportDate, setReportDate] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  
  useEffect(() => {
    if (!open) {
      setReportDate('');
      setDescription('');
      setFiles([]);
    }
  }, [open]);
  
  if (!open || !activity) return null;

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filePromises = selectedFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            type: file.type.startsWith('image/') ? 'image' : 'pdf',
            url: e.target.result, // base64 string
            name: file.name,
            dataUrl: e.target.result // Store base64 for persistence
          });
        };
        reader.readAsDataURL(file);
      });
    });
    
    const fileData = await Promise.all(filePromises);
    setFiles([...files, ...fileData]);
  };
  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Upload className="text-emerald-600" size={28} />
            Input Bukti Kegiatan
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e, {
            title: `Laporan ${activity.indicator}`,
            date: reportDate,
            description: description,
            files: files
          });
        }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Indikator</label>
              <input type="text" className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700" defaultValue={activity.indicator} readOnly />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Timeline</label>
              <input type="text" className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700" defaultValue={activity.tw} readOnly />
            </div>
          </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Dokumentasi (Foto/PDF)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                <input 
                  type="file" 
                  className="hidden" 
                  id="file-upload-modal" 
                  accept="image/*,application/pdf" 
                  multiple 
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload-modal" className="cursor-pointer">
                  <span className="text-emerald-600 font-semibold hover:text-emerald-700">Upload file</span>
                  <span className="text-gray-600"> atau drag and drop</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG, PDF hingga 10MB</p>
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Deskripsi Pelaksanaan</label>
              <textarea 
                rows="5" 
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                placeholder="Jelaskan detail pelaksanaan kegiatan..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Tanggal Pelaksanaan</label>
            <ModernDatePicker
              value={reportDate}
              onChange={setReportDate}
              placeholder="Pilih tanggal pelaksanaan"
              className="w-full"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-semibold">Submit Laporan</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 transition-all font-semibold">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;


