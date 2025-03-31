import ExcelJS from 'exceljs';

// Simple enhancement to detect data types based on content
function detectDataType(value: string): string {
  if (value.startsWith('$') || value.includes('price') || value.includes('cost') || 
      value.includes('revenue') || value.includes('income') || value.includes('expense')) {
    return 'currency';
  } else if (value.includes('%') || value.includes('percent') || value.includes('rate')) {
    return 'percentage';
  } else if (value.includes('date') || value.includes('time')) {
    return 'date';
  } else if (value.includes('number') || value.includes('count') || value.includes('amount')) {
    return 'number';
  }
  return 'text';
}

// Apply formatting based on column name
function applyColumnFormatting(worksheet: ExcelJS.Worksheet, headers: string[]) {
  headers.forEach((header, index) => {
    const col = index + 1;
    const type = detectDataType(header.toLowerCase());
    
    // Format all cells in this column (excluding header)
    for (let row = 2; row < 100; row++) { // Apply to first 100 rows for performance
      const cell = worksheet.getCell(row, col);
      
      switch (type) {
        case 'currency':
          cell.numFmt = '$#,##0.00';
          cell.alignment = { horizontal: 'right' };
          break;
        case 'percentage':
          cell.numFmt = '0.00%';
          cell.alignment = { horizontal: 'right' };
          break;
        case 'date':
          cell.numFmt = 'mm/dd/yyyy';
          cell.alignment = { horizontal: 'center' };
          break;
        case 'number':
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
          break;
        default:
          cell.alignment = { horizontal: 'left' };
          break;
      }
    }
  });
}

export async function generateSpreadsheet(
  headers: string[],
  formulas: { cell: string; formula: string }[]
) {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add headers
  worksheet.getRow(1).values = headers;

  // Enhanced header formatting
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, size: 12 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'F2F2F2' }
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  // Apply formula
  formulas.forEach(({ cell, formula }) => {
    const cellRef = worksheet.getCell(cell);
    // Set the value as a formula
    cellRef.value = { formula: formula };
  });

  // Apply smart column formatting based on header names
  applyColumnFormatting(worksheet, headers);
  
  // Auto-size columns for better readability
  worksheet.columns.forEach(column => {
    column.width = 15; // Default width
  });

  // Add auto-filter to headers
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length }
  };

  // Generate buffer
  return await workbook.xlsx.writeBuffer();
}