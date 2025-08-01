import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../services/api";
import { toast } from "react-toastify";

const UploadModal = ({ onClose })=> {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateData = (data) => {
    const errors = [];
    data.forEach((row, index) => {
      const rowNumber = index + 2;
      const rowErrors = {};

      if (!row.FirstName || typeof row.FirstName !== "string") {
        rowErrors.FirstName = "FirstName is required and must be text";
      }
      if (!row.Phone || isNaN(row.Phone)) {
        rowErrors.Phone = "Phone is required and must be a number";
      }
      if (!row.Notes || typeof row.Notes !== "string") {
        rowErrors.Notes = "Notes is required and must be text";
      }
      if (Object.keys(rowErrors).length > 0) {
        errors.push({ Row: rowNumber, ...rowErrors });
      }
    });
    return errors;
  };

  const handleErrorDownload = (errors) => {
    const csv = Papa.unparse(errors);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "validation_errors.csv");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(selectedFile?.type)) {
      alert("Only .csv, .xlsx, .xls files are allowed");
      return setFile(null);
    }
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
    toast.error("Please select a file to upload");
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      let parsedData = [];

      if (file.name.endsWith(".csv")) {
        const result = Papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
        });
        parsedData = result.data;
      } else {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(sheet);
      }

      const errors = validateData(parsedData);
      if (errors.length > 0) {
        handleErrorDownload(errors);
        toast.error("Validation failed. Downloading error file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        setIsUploading(true);
        await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("File uploaded and distributed");
        setFile(null);
        onClose(); // close modal after success
      } catch (err) {
        alert("Upload failed");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      { FirstName: "John", Phone: "1234567890", Notes: "Sample note" },
      { FirstName: "Jane", Phone: "9876543210", Notes: "Another note" },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "sample.xlsx");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload CSV/XLSX File</h2>
      <button
        onClick={downloadSampleFile}
        className="mb-4 w-full py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white"
      >
        Download Sample Excel
      </button>

      <input
        type="file"
        accept=".csv, .xlsx, .xls"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded mb-4 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`w-full py-2 px-4 rounded text-white ${
          file && !isUploading ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isUploading ? "Uploading..." : "Upload & Distribute"}
      </button>
    </div>
  );
}

export default UploadModal;

