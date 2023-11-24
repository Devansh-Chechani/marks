// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';
// import './ExcelUploader.css';

// const ExcelUploader = () => {
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState(null);
//   const [chart, setChart] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     return () => {
//       if (chart) {
//         chart.destroy();
//       }
//     };
//   }, [chart]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);

//     const reader = new FileReader();

//     reader.onload = (event) => {
//       try {
//         const binaryString = event.target.result;
//         const data = new Uint8Array(binaryString);
//         const workbook = XLSX.read(data, { type: 'array' });

//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];

//         // Skip the first row (header)
//         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 'A', range: 1 });
//         console.log(jsonData)
//         setData(jsonData);
//         setError(null);
//       } catch (error) {
//         setError("Error reading the Excel file. Please make sure it's a valid file.");
//         setData(null);
//       }
//     };

//     reader.readAsArrayBuffer(selectedFile);
//   };

//   const prepareChartData = () => {
//     if (!data) {
//       return { labels: [], datasets: [] };
//     }

//     const marks = data.map((entry) => entry.Marks); // Assuming the "Marks" field is case-sensitive
//     const bins = Array.from({ length: 11 }, (_, index) => index * 10);

//     const counts = Array.from({ length: bins.length - 1 }, () => 0);

//     marks.forEach((mark) => {
//       const binIndex = Math.floor(mark / 10);
//       counts[binIndex]++;
//     });

//     // Normalize counts to be between 1 and 100
//     const maxCount = Math.max(...counts);
//     const scaleFactor = maxCount > 100 ? maxCount / 100 : 1;

//     const normalizedCounts = counts.map((count) => Math.round(count / scaleFactor));

//     const labels = bins.slice(0, -1).map((bin, index) => `${bin}-${bin + 9}`);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Number of Students',
//           backgroundColor: 'rgba(75,192,192,0.4)',
//           borderColor: 'rgba(75,192,192,1)',
//           borderWidth: 1,
//           hoverBackgroundColor: 'rgba(75,192,192,0.6)',
//           hoverBorderColor: 'rgba(75,192,192,1)',
//           data: normalizedCounts,
//         },
//       ],
//     };
//   };

//   return (
//     <div className="excel-uploader-container">
//       <input type="file" onChange={handleFileChange} />
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {data && (
//         <div>
//           <h2>Graphical Analysis</h2>
//           <Bar
//             data={prepareChartData()}
//             options={{
//               scales: {
//                 x: {
//                   type: 'category',
//                 },
//                 y: {
//                   beginAtZero: true,
//                   max: 100,
//                 },
//               },
//             }}
//             onElementsClick={(elem) => console.log(elem)}
//             ref={(reference) => setChart(reference)}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExcelUploader;


/* 
  import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const ExcelUploader = () => {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    // Check if the file is of type Excel
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const reader = new FileReader();

      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet is the one you want to log
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Log the data to the console
        console.log(jsonData);
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.error('Invalid file type. Please upload an Excel file.');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx',
  });

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop an Excel file here, or click to select one</p>
      </div>
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default ExcelUploader;
*/

import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ExcelUploader = () => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    // Check if the file is of type Excel
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const reader = new FileReader();

      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet is the one you want to log
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Log the data to the console
        console.log(jsonData);

        // Process the data and create a bar graph
        setData(jsonData);

        // Destroy the previous chart instance before rendering a new one
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        // Render the chart
        renderChart();
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.error('Invalid file type. Please upload an Excel file.');
    }
  }, []);

  const renderChart = () => {
    const ctx = document.getElementById('bar-chart');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: prepareChartData(),
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Marks Range',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Number of Students',
              },
              beginAtZero: true,
              stepSize: 10, // Set the interval between ticks
              max: 100, // Set the maximum value for the y-axis
            },
          },
        },
      });

      // Save the chart instance to the ref
      chartRef.current = chart;
    }
  };

  const prepareChartData = () => {
    if (!data) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Number of Students',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.6)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: [],
          },
        ],
      };
    }

    const marks = data.map((entry) => entry.Marks);

    // Count the number of students in each range of 10
    const counts = Array.from({ length: 10 }, () => 0);

    marks.forEach((mark) => {
      const binIndex = Math.floor(mark / 10);
      counts[binIndex]++;
    });

    // Create labels for each range
    const labels = counts.map((_, index) => `${index * 10}-${(index + 1) * 10 - 1}`);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Students',
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.6)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data: counts,
        },
      ],
    };
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx',
  });

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>

        <input {...getInputProps()} />
      
        <p>Drag 'n' drop an Excel file here, or click to select one</p>
      </div>

      {data && (
        <div>
          <h2>Graphical Analysis</h2>
          <Bar
            data={prepareChartData()}
            options={{
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Marks Range',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Number of Students',
                  },
                  beginAtZero: true,
                  stepSize: 10, // Set the interval between ticks
                  max: 50, // Set the maximum value for the y-axis
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  display:'flex',
  justifyContent:'center',
  alignItems:'center'
};

export default ExcelUploader;

// import React, { useCallback, useState, useRef } from 'react';
// import { useDropzone } from 'react-dropzone';
// import * as XLSX from 'xlsx';
// import { Bar } from 'react-chartjs-2';
// import Chart from 'chart.js/auto';

// const ExcelUploader = () => {
//   const [data, setData] = useState(null);
//   const [subject, setSubject] = useState('');
//   const chartRef = useRef(null);

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];

//     // Check if the file is of type Excel
//     if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       const reader = new FileReader();

//       reader.onload = function (e) {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });

//         // Assuming the first sheet is the one you want to log
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet);

//         // Log the data to the console
//         console.log(jsonData);

//         // Process the data and create a bar graph
//         setData(jsonData);

//         // Destroy the previous chart instance before rendering a new one
//         if (chartRef.current) {
//           chartRef.current.destroy();
//         }

//         // Render the chart
//         renderChart();
//       };

//       reader.readAsArrayBuffer(file);
//     } else {
//       console.error('Invalid file type. Please upload an Excel file.');
//     }
//   }, []);

//   const renderChart = () => {
//     const ctx = document.getElementById('bar-chart');
//     if (ctx) {
//       const chart = new Chart(ctx, {
//         type: 'bar',
//         data: prepareChartData(),
//         options: {
//           scales: {
//             x: {
//               title: {
//                 display: true,
//                 text: 'Marks Range',
//               },
//             },
//             y: {
//               title: {
//                 display: true,
//                 text: 'Number of Students',
//               },
//               beginAtZero: true,
//               stepSize: 10, // Set the interval between ticks
//               max: 100, // Set the maximum value for the y-axis
//             },
//           },
//         },
//       });

//       // Save the chart instance to the ref
//       chartRef.current = chart;
//     }
//   };

//   const prepareChartData = () => {
//     if (!data) {
//       return {
//         labels: [],
//         datasets: [
//           {
//             label: 'Number of Students',
//             backgroundColor: 'rgba(75,192,192,0.4)',
//             borderColor: 'rgba(75,192,192,1)',
//             borderWidth: 1,
//             hoverBackgroundColor: 'rgba(75,192,192,0.6)',
//             hoverBorderColor: 'rgba(75,192,192,1)',
//             data: [],
//           },
//         ],
//       };
//     }

//     const marks = data.map((entry) => entry.Marks);

//     // Count the number of students in each range of 10
//     const counts = Array.from({ length: 10 }, () => 0);

//     marks.forEach((mark) => {
//       const binIndex = Math.floor(mark / 10);
//       counts[binIndex]++;
//     });

//     // Create labels for each range
//     const labels = counts.map((_, index) => `${index * 10}-${(index + 1) * 10 - 1}`);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Number of Students',
//           backgroundColor: 'rgba(75,192,192,0.4)',
//           borderColor: 'rgba(75,192,192,1)',
//           borderWidth: 1,
//           hoverBackgroundColor: 'rgba(75,192,192,0.6)',
//           hoverBorderColor: 'rgba(75,192,192,1)',
//           data: counts,
//         },
//       ],
//     };
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: '.xlsx',
//   });

//   return (
//     <div style={containerStyle}>
//       <div style={centerBoxStyle}>
//         Marks Analysis
//         <div style={subjectBoxStyle}>
//           <label>
//             Subject:
//             <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
//           </label>
//         </div>

//         <div {...getRootProps()} style={dropzoneStyle}>
//           <input {...getInputProps()} />
//           <p>Drag 'n' drop an Excel file here, or click to select one</p>
//         </div>
//       </div>

//       {data && (
//         <div>
//           <h2>Graphical Analysis</h2>
//           <Bar
//             data={prepareChartData()}
//             options={{
//               scales: {
//                 x: {
//                   title: {
//                     display: true,
//                     text: 'Marks Range',
//                   },
//                 },
//                 y: {
//                   title: {
//                     display: true,
//                     text: 'Number of Students',
//                   },
//                   beginAtZero: true,
//                   stepSize: 10, // Set the interval between ticks
//                   max: 100, // Set the maximum value for the y-axis
//                 },
//               },
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// const containerStyle = {
//   display: 'flex',
  
//   justifyContent: 'space-around',
//   alignItems: 'center',
//   height: '100vh',
// };

// const centerBoxStyle = {
//   width: '300px',
//   height: '300px',
//   border: '2px solid black',
//   borderRadius: '4px',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   gap:'10px',
//   padding: '10px',
//   textAlign: 'center',
 
// };

// const dropzoneStyle = {
//   border: '2px dashed #cccccc',
//   borderRadius: '4px',
//   padding: '10px',
//   textAlign: 'center',
//   cursor: 'pointer',
// };

// const subjectBoxStyle = {
//   leftMargin:'30px',
//   padding: '10px',
//   textAlign: 'center',
// };

// export default ExcelUploader;
