// /frontend/components/ReportCard.tsx
interface Report {
  id: string;
  dns_exfil_found: boolean;
  ssrf_found: boolean;
  timestamp: string;
  pdf_path: string | null;
}

export default function ReportCard({ report }: { report: Report }) {
  // In a real app, pdf_path would be a secure, signed URL from your backend.
  // For this MVP, we are just displaying the path.
  const pdfDownloadUrl = report.pdf_path 
    ? `${process.env.NEXT_PUBLIC_API_URL}/reports/download/${report.id}` 
    : null;

  return (
    <div className="p-4 rounded-md border bg-card text-card-foreground">
      <h3 className="font-bold">Report ID: {report.id.substring(0, 8)}</h3>
      <p>DNS exfil pattern: {report.dns_exfil_found ? '⚠️ DETECTED' : '✅ Clear'}</p>
      <p>SSRF risk: {report.ssrf_found ? '⚠️ DETECTED' : '✅ Clear'}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
            {new Date(report.timestamp).toLocaleString()}
        </p>
        {/* We will add the download functionality in the next step */}
        {/* {pdfDownloadUrl && (
          <a href={pdfDownloadUrl} className="underline text-sm text-blue-500">📄 Download PDF</a>
        )} */}
      </div>
    </div>
  );
}