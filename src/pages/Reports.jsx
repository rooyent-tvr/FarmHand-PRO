import { useEffect, useState } from "react";

import PageContainer from "../components/layout/PageContainer";

import ReportStats from "../components/reports/ReportStats";
import IncomeExpenseChart from "../components/reports/IncomeExpenseChart";

import { getFarmReport } from "../services/reportService";

export default function Reports() {
  const [report, setReport] = useState({
    totalAnimals: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
  });

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      const data = await getFarmReport();
      setReport(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <PageContainer
      title="📊 Reports"
      subtitle="Farm Reports & Analytics"
    >
      <ReportStats />

      <IncomeExpenseChart
        income={report.totalIncome}
        expenses={report.totalExpenses}
      />

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: 40,
          marginTop: 30,
          boxShadow:
            "0 8px 20px rgba(15,23,42,.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginTop: 0,
          }}
        >
          🚀 Coming in Sprint 15
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 24,
            marginTop: 30,
          }}
        >
          <div>
            <h3>📈 Financial Analytics</h3>
            <ul>
              <li>Monthly Profit Trends</li>
              <li>Expense Breakdown</li>
              <li>Income Analysis</li>
            </ul>
          </div>

          <div>
            <h3>🐄 Livestock Reports</h3>
            <ul>
              <li>Weight Growth</li>
              <li>Breeding Performance</li>
              <li>Health Summary</li>
            </ul>
          </div>

          <div>
            <h3>📄 Exports</h3>
            <ul>
              <li>PDF Reports</li>
              <li>Excel Export</li>
              <li>CSV Export</li>
            </ul>
          </div>

          <div>
            <h3>📊 Business Intelligence</h3>
            <ul>
              <li>Most Profitable Animal</li>
              <li>Highest Expenses</li>
              <li>Farm KPIs</li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
