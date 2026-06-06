import styled from 'styled-components';

const TableWrap = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th {
    background: #f8fafc;
    color: #166534;
    font-weight: 700;
    text-align: left;
    padding: 12px 16px;
    border-bottom: 2px solid #dcfce7;
    white-space: nowrap;
  }

  td {
    padding: 10px 16px;
    color: #475569;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: top;
  }

  tr:last-child td { border-bottom: none; }

  tr:hover td { background: #fafafa; }
`;

const DataTable = ({ columns, rows }) => (
  <TableWrap>
    <Table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  </TableWrap>
);

export default DataTable;
