[1mdiff --git a/src/datatable.tsx b/src/datatable.tsx[m
[1mindex 20f9172..71ae083 100644[m
[1m--- a/src/datatable.tsx[m
[1m+++ b/src/datatable.tsx[m
[36m@@ -442,47 +442,47 @@[m [mconst inputTwoClass = otraVertiba && isNaN(Number(otraVertiba)) ? 'red-backgroun[m
 [m
         <TabPanel>[m
             <div className="mekletvalsti">[m
[31m-            <label htmlFor="search">Meklēt pēc Valsts:</label>[m
[31m-            <input[m
[31m-              id="search"[m
[31m-              type="text"[m
[31m-              value={searchQuery}[m
[31m-              onChange={handleSearchInputChange}[m
[31m-            />[m
[31m-            <label htmlFor="search">Filtrēt Pēc Lauka:</label>[m
[31m-[m
[31m-            <select[m
[31m-              id="search"[m
[31m-              value={DropDownItem}[m
[31m-              onChange={handleDropDownItem}[m
[31m-            >[m
[31m-              <option value="">Izvēlieties lauku</option>[m
[31m-              {columnNames.map((columnName, index) => ([m
[31m-                <option key={index} value={columnName}>[m
[31m-                  {columnName}[m
[31m-                </option>[m
[31m-              ))}[m
[31m-            </select>[m
[31m-[m
[31m-            <label htmlFor="VertibaViens">Minimālā vērtība:</label>[m
[31m-            <input[m
[31m-              id="VertibaViens"[m
[31m-              type="text"[m
[31m-              value={pirmaVertiba}[m
[31m-              onChange={handlePirmaVertiba}[m
[31m-              className={inputOneClass}[m
[31m-            />[m
[31m-            <label htmlFor="VertibaDivi">Maksimālā vērtība:</label>[m
[31m-            <input[m
[31m-              id="VertibaDivi"[m
[31m-              type="text"[m
[31m-              value={otraVertiba}[m
[31m-              onChange={handleOtraVertiba}[m
[31m-              className={inputTwoClass}[m
[31m-            />[m
[31m-            <button className="btn btn-primary" onClick={fetchData}>[m
[31m-              Notirit visus filtrus[m
[31m-            </button>[m
[32m+[m[32m              <label htmlFor="search">Meklēt pēc Valsts:</label>[m
[32m+[m[32m              <input[m
[32m+[m[32m                id="search"[m
[32m+[m[32m                type="text"[m
[32m+[m[32m                value={searchQuery}[m
[32m+[m[32m                onChange={handleSearchInputChange}[m
[32m+[m[32m              />[m
[32m+[m[32m              <label htmlFor="search">Filtrēt Pēc Lauka:</label>[m
[32m+[m
[32m+[m[32m              <select[m
[32m+[m[32m                id="search"[m
[32m+[m[32m                value={DropDownItem}[m
[32m+[m[32m                onChange={handleDropDownItem}[m
[32m+[m[32m              >[m
[32m+[m[32m                <option value="">Izvēlieties lauku</option>[m
[32m+[m[32m                {columnNames.map((columnName, index) => ([m
[32m+[m[32m                  <option key={index} value={columnName}>[m
[32m+[m[32m                    {columnName}[m
[32m+[m[32m                  </option>[m
[32m+[m[32m                ))}[m
[32m+[m[32m              </select>[m
[32m+[m
[32m+[m[32m              <label htmlFor="VertibaViens">Minimālā vērtība:</label>[m
[32m+[m[32m              <input[m
[32m+[m[32m                id="VertibaViens"[m
[32m+[m[32m                type="text"[m
[32m+[m[32m                value={pirmaVertiba}[m
[32m+[m[32m                onChange={handlePirmaVertiba}[m
[32m+[m[32m                className={inputOneClass}[m
[32m+[m[32m              />[m
[32m+[m[32m              <label htmlFor="VertibaDivi">Maksimālā vērtība:</label>[m
[32m+[m[32m              <input[m
[32m+[m[32m                id="VertibaDivi"[m
[32m+[m[32m                type="text"[m
[32m+[m[32m                value={otraVertiba}[m
[32m+[m[32m                onChange={handleOtraVertiba}[m
[32m+[m[32m                className={inputTwoClass}[m
[32m+[m[32m              />[m
[32m+[m[32m              <button className="btn btn-primary" onClick={fetchData}>[m
[32m+[m[32m                Notirit visus filtrus[m
[32m+[m[32m              </button>[m
             </div>[m
           <div className="ag-theme-alpine" style={{ height: '1000px', width: '100%' }}>[m
             <AgGridReact[m
