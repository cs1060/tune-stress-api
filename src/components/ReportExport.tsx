
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { TestResult } from '@/models/PerformanceMetrics';
import { downloadCSV, downloadJSON } from '@/services/ReportExportService';
import { 
  ChevronDown, 
  FileJson, 
  FileSpreadsheet, 
  Download
} from 'lucide-react';

interface ReportExportProps {
  testResult: TestResult;
  className?: string;
}

const ReportExport: React.FC<ReportExportProps> = ({ testResult, className }) => {
  const handleExportCSV = () => {
    const filename = `stress-api-${testResult.config.id}-${new Date().getTime()}.csv`;
    downloadCSV(testResult, filename);
  };
  
  const handleExportJSON = () => {
    const filename = `stress-api-${testResult.config.id}-${new Date().getTime()}.json`;
    downloadJSON(testResult, filename);
  };
  
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Report
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
            <FileSpreadsheet size={16} />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportJSON} className="gap-2 cursor-pointer">
            <FileJson size={16} />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReportExport;
