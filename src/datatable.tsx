import React, { useEffect, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './datudizains.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-tabs/style/react-tabs.css'; // Import the default styles for react-tabs


const CovidDati: React.FC = () => {
  const [minDateRange, setMinDateRange] = useState<string>('');
  const [maxDateRange, setMaxDateRange] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [DropDownItem, setDropDownItem] = useState<string>('');
  const [pirmaVertiba, setPirmaVertiba] = useState<string>('');
  const [otraVertiba, setOtraVertiba] = useState<string>('');
  const [countryData, setCountryData] = useState<Record<string, { totalCases: number; totalDeaths: number; casesPer1000?: number; deathsPer1000?: number }> | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<any>(null);
  const chartInstance = useRef<Chart>();

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
  
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [
              {
                label: 'Placeholder Data',
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  
    // Cleanup function to destroy the chart instance
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  
  

  useEffect(() => {
    fetchDates();
  }, []);


  const fetchDates = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://opendata.ecdc.europa.eu/covid19/casedistribution/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      let minDate: Date | null = null;
      let maxDate: Date | null = null;

      for (const record of data.records) {
        const dateParts = record.dateRep.split('/');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const currentDate = new Date(year, month - 1, day);

          if (!minDate || currentDate < minDate) {
            minDate = currentDate;
          }

          if (!maxDate || currentDate > maxDate) {
            maxDate = currentDate;
          }
        }
      }

      if (minDate && maxDate) {
        setFromDate(minDate.toISOString().slice(0, 10));
        setToDate(maxDate.toISOString().slice(0, 10));
        setMinDateRange(minDate.toISOString().slice(0, 10));
        setMaxDateRange(maxDate.toISOString().slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  const fetchData = async () => {
    setLoading(true);
    clearInputs();
    try {
      const response = await fetch('https://opendata.ecdc.europa.eu/covid19/casedistribution/json/');
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
  
      const tempCountryData: Record<string, { totalCases: number; totalDeaths: number; casesPer1000?: number; deathsPer1000?: number }> = {};
  

      const records = data.records as {
        countriesAndTerritories: string;
        cases: string;
        deaths: string;
        popData2019: string;
      }[];
      


  
      records.forEach((record) => {
        const { countriesAndTerritories, cases, deaths, popData2019 } = record;
        if (!tempCountryData[countriesAndTerritories]) {
          tempCountryData[countriesAndTerritories] = { totalCases: 0, totalDeaths: 0 };
        }
        tempCountryData[countriesAndTerritories].totalCases += parseInt(cases);
        tempCountryData[countriesAndTerritories].totalDeaths += parseInt(deaths);
  
        const population = parseInt(popData2019);
        if (population) {
          tempCountryData[countriesAndTerritories].casesPer1000 = (parseInt(cases) / population) * 1000;
          tempCountryData[countriesAndTerritories].deathsPer1000 = (parseInt(deaths) / population) * 1000;
          
        }
      });
  
  
      setCountryData(tempCountryData);
  
      const filteredData = data.records.filter((record: { dateRep: string }) => {
        const dateRep = new Date(record.dateRep);
        return dateRep >= new Date(fromDate) && dateRep <= new Date(toDate);
      });

      filteredData.sort((a: { dateRep: string }, b: { dateRep: string }) => new Date(a.dateRep).getTime() - new Date(b.dateRep).getTime());

      const groupedData: { [dateRep: string]: { dateRep: string; totalCases: number; totalDeaths: number } } = {};
        filteredData.forEach((record: { dateRep: string; cases: number; deaths: number }) => {
          const dateRep = record.dateRep;
          if (!groupedData[dateRep]) {
            groupedData[dateRep] = {
              dateRep: dateRep,
              totalCases: 0,
              totalDeaths: 0,
            };
          }
          groupedData[dateRep].totalCases += record.cases;
          groupedData[dateRep].totalDeaths += record.deaths;
        });
      
      const chartData = {
        labels: Object.keys(groupedData),
        datasets: [
          {
            label: 'Gadījumi',
            data: Object.values(groupedData).map((data) => data.totalCases),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0, // Set tension to 0
            pointRadius: 0, // Set point radius to 0
          },
          {
            label: 'Nāves',
            data: Object.values(groupedData).map((data) => data.totalDeaths),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0, // Set tension to 0
            pointRadius: 0, // Set point radius to 0
          },
        ],
      };
      

      
      
      
      
      
      

  
      setChartData(chartData);

  
      setRowData(filteredData);
  
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  


  const columnDefs: ColDef[] = [
    { headerName: 'Valsts', field: 'countriesAndTerritories' },
    { headerName: 'Gadījumu skaits', field: 'cases' },
    { headerName: 'Nāves gadījumu skaits', field: 'deaths', filter: "agSetColumnFilter"},
    {
      headerName: 'Gadījumu skaits kopā(Viss Laiks)',filter: "agSetColumnFilter",
      valueGetter: (params: any) => {
        const countryName = params.data.countriesAndTerritories;
        if (countryData && countryData[countryName]) {
          return countryData[countryName].totalCases;
        }
        return '';
      }
    },
    {
      headerName: 'Nāves gadījumi kopā(Viss Laiks)',
      valueGetter: (params: any) => {
        const countryName = params.data.countriesAndTerritories;
        if (countryData && countryData[countryName]) {
          return countryData[countryName].totalDeaths;
        }
        return '';
      }
    },
    { headerName: 'Gadījumu skaits uz 1000 iedzīvotājiem',
      valueGetter: (params: any) => {
        const countryName = params.data.countriesAndTerritories;
        if (countryData && countryData[countryName]) {
          return countryData[countryName].casesPer1000;
        }
        return '';
      }
    },
    { headerName: 'Nāves gadījumi uz 1000 iedzīvotājiem',
      valueGetter: (params: any) => {
      const countryName = params.data.countriesAndTerritories;
      if (countryData && countryData[countryName]) {
        return countryData[countryName].deathsPer1000;
      }
      return '';
      }
     },
  ];
  

  const gridOptions = {
    defaultColDef: {
      resizable: true,
      headerClass: 'multiline-header',
      flex: getFlexValue(),
    },
  };
  
  function getFlexValue() {
    const screenWidth = window.innerWidth;
    const threshold = 900;
    if (screenWidth < threshold) {
      return 0;
    } else {
      return 1;
    }
  }
  
  window.addEventListener('resize', () => {
    gridOptions.defaultColDef.flex = getFlexValue();
  });
  

  
  const columnNames = columnDefs
  .filter(column => column.headerName !== 'Valsts')
  .filter(column => column.headerName !== 'Gadījumu skaits uz 1000 iedzīvotājiem')
  .filter(column => column.headerName !== 'Nāves gadījumi uz 1000 iedzīvotājiem')
  .map(column => column.headerName);


  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };


  const handlePirmaVertiba = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPirmaVertiba(e.target.value);
  };

  const handleOtraVertiba = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtraVertiba(e.target.value);
  };


  const handleDropDownItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDropDownItem(e.target.value);
  };
  rowData.filter((record) => {
  });
  const filteredRowData = rowData.filter((record) => {
    const countryMatches = record.countriesAndTerritories.toLowerCase().includes(searchQuery.toLowerCase());
    const pirmaVertibaValue = pirmaVertiba.trim() === '' ? -Infinity : parseFloat(pirmaVertiba);
    const otraVertibaValue = otraVertiba.trim() === '' ? Infinity : parseFloat(otraVertiba);

    let dropdownItemInRange = true;

    if (DropDownItem === 'Gadījumu skaits') {
        dropdownItemInRange = record.cases >= pirmaVertibaValue && record.cases <= otraVertibaValue;
    }
    if (DropDownItem === 'Nāves gadījumu skaits') {
        dropdownItemInRange = record.deaths >= pirmaVertibaValue && record.deaths <= otraVertibaValue;
    }
    if (DropDownItem === 'Nāves gadījumi kopā(Viss Laiks)') {
        const countryName = record.countriesAndTerritories;
        const countryDeaths = countryData && countryData[countryName] ? countryData[countryName].totalDeaths : 0;
        dropdownItemInRange = countryDeaths >= pirmaVertibaValue && countryDeaths <= otraVertibaValue;
    }
    if (DropDownItem === 'Gadījumu skaits kopā(Viss Laiks)') {
      const countryName = record.countriesAndTerritories;
      const countryCases = countryData && countryData[countryName] ? countryData[countryName].totalCases : 0;
      dropdownItemInRange = countryCases >= pirmaVertibaValue && countryCases <= otraVertibaValue;
    }

    return countryMatches && dropdownItemInRange;
});




const clearInputs = () => {
  setPirmaVertiba('');
  setOtraVertiba('');
  setDropDownItem('');
  setSearchQuery('');
};


  const inputOneClass = pirmaVertiba && isNaN(Number(pirmaVertiba)) ? 'red-background' : '';
  const inputTwoClass = otraVertiba && isNaN(Number(otraVertiba)) ? 'red-background' : '';

  

  return (
    <div className="container">
      <div>
        <label>No Perioda</label>
        <input
          id="fromDate"
          type="date"
          value={fromDate}
          onChange={handleFromDateChange}
          min={minDateRange}
          max={maxDateRange}
          className="Datums"
        />
      </div>
      <div>
        <label>Līdz Periodam</label>
        <input
          id="toDate"
          type="date"
          value={toDate}
          onChange={handleToDateChange}
          min={minDateRange}
          max={maxDateRange}
          className="Datums"
        />
        <button className="btn btn-primary" onClick={fetchDates}>
          Reset Dates
        </button>
      </div>

      <Tabs>
        <TabList>
          <Tab>Tabula</Tab>
          <Tab>Grafiks</Tab>
        </TabList>

        <TabPanel>
            <div className="mekletvalsti">
            <label htmlFor="search">Meklēt pēc Valsts:</label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <label htmlFor="search">Filtrēt Pēc Lauka:</label>

            <select
              id="search"
              value={DropDownItem}
              onChange={handleDropDownItem}
            >
              <option value="">Izvēlieties lauku</option>
              {columnNames.map((columnName, index) => (
                <option key={index} value={columnName}>
                  {columnName}
                </option>
              ))}
            </select>

            <label htmlFor="VertibaViens">Minimālā vērtība:</label>
            <input
              id="VertibaViens"
              type="text"
              value={pirmaVertiba}
              onChange={handlePirmaVertiba}
              className={inputOneClass}
            />
            <label htmlFor="VertibaDivi">Maksimālā vērtība:</label>
            <input
              id="VertibaDivi"
              type="text"
              value={otraVertiba}
              onChange={handleOtraVertiba}
              className={inputTwoClass}
            />
            <button className="btn btn-primary" onClick={fetchData}>
              Notirit visus filtrus
            </button>
            </div>
          <div className="ag-theme-alpine" style={{ height: '1000px', width: '100%' }}>
            <AgGridReact
              gridOptions={gridOptions}
              columnDefs={columnDefs}
              rowData={filteredRowData}
              pagination={true}
              paginationPageSizeSelector={[50, 100, 200, 500, 1000]}
              paginationPageSize={100}
            />
          </div>
        </TabPanel>

        <TabPanel>
        <div>
            <Line data={chartData} />
        </div>
        </TabPanel>

      </Tabs>
    </div>
  );
  
  
};
export default CovidDati;
