import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: calc(1.05rem * var(--viz-font-scale, 1));
  font-family: ui-monospace, monospace;

  th, td {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    text-align: left;
  }

  th {
    background: #f0fdf4;
    color: #166534;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  tr.viz-grid-row-active td,
  tr.viz-embed-row-active td {
    background: #dcfce7;
    border-color: #166534;
    font-weight: 700;
  }

  ${(p) => p.$animateRows && `
    tbody tr {
      opacity: 0;
    }
  `}
`;

const VizDataGrid = ({ columns, rows, rowClassName = 'viz-grid-row', activeRowClass = 'viz-grid-row-active', animateRows = false }) => (
  <Table className="viz-data-grid" $animateRows={animateRows}>
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.key} style={{ width: col.width }}>{col.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr
          key={row.id}
          className={`${rowClassName} ${row.active ? activeRowClass : ''} ${row.className ?? ''}`}
          data-row-id={row.id}
        >
          {columns.map((col) => (
            <td key={col.key}>{row[col.key]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
);

export default VizDataGrid;
