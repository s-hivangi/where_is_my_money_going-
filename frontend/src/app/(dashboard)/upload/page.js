"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BANKS = [
  "HDFC Bank",
  "SBI",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Yes Bank",
  "IndusInd Bank",
  "Other"
];

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [bankName, setBankName] = useState("");
  const [pdfPassword, setPdfPassword] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setError("");
    } else {
      setError("Only PDF files are accepted");
    }
  }

  function handleFileSelect(e) {
    const selected = e.target.files[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setError("Only PDF files are accepted");
    }
  }

  function handleRemoveFile(e) {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (!file) return setError("Please select a file");
    if (!bankName) return setError("Please select your bank");

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bankName", bankName);
    if (pdfPassword) {
      formData.append("pdfPassword", pdfPassword);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
    }
  }

  // success state
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Statement Processed!</h2>
          <p className="text-white/40 text-sm mb-6">
            {result.inserted} transactions added • {result.skipped} duplicates skipped
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
            >
              View Dashboard
            </button>
            <button
              onClick={() => { setResult(null); setFile(null); setBankName(""); setPdfPassword(""); }}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
            >
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Upload Statement</h1>
        <p className="text-white/40 text-sm mt-1">
          Upload your bank statement PDF — our AI reads, extracts and categorizes every transaction automatically
        </p>
      </div>

      {/* bank selector */}
      <div className="mb-6">
        <label className="text-xs text-white/50 mb-2 block">Select Your Bank</label>
        <select
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition"
        >
          <option value="">Choose your bank...</option>
          {BANKS.map((bank) => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="text-xs text-white/50 mb-2 block">PDF Password</label>
        <input
          type="password"
          value={pdfPassword}
          onChange={(e) => setPdfPassword(e.target.value)}
          placeholder="Leave blank if the PDF is not password-protected"
          className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-purple-500 transition"
        />
      </div>

      {/* drag and drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition cursor-pointer ${
          dragging
            ? "border-purple-500 bg-purple-500/10"
            : file
            ? "border-green-500/50 bg-green-500/5"
            : "border-white/10 hover:border-white/20 bg-[#12121a]"
        }`}
      >
        <input
          ref={fileInputRef}
          id="fileInput"
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">{file.name}</p>
              <p className="text-white/30 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-white/60 text-sm">Drag and drop your PDF here</p>
              <p className="text-white/30 text-xs mt-1">or click to browse — PDF only, max 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* processing info */}
      <div className="mt-4 bg-[#12121a] border border-white/5 rounded-xl p-4">
        <p className="text-white/40 text-xs font-medium mb-2">WHAT HAPPENS NEXT</p>
        <div className="flex flex-col gap-2">
          {[
            "AI reads your PDF using OCR",
            "LLM extracts and structures every transaction",
            "Transactions are categorized automatically",
            "Your dashboard updates with new insights"
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <span className="text-white/40 text-xs">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* error */}
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading || !file || !bankName}
        className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Processing your statement...
          </>
        ) : (
          "Upload & Analyze Statement →"
        )}
      </button>

      <p className="text-white/20 text-xs text-center mt-4">
        Your data is processed securely and never shared
      </p>
    </div>
  );
}
