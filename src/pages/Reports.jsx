import { useEffect, useState } from "react";

import PageContainer from "../components/layout/PageContainer";

import ReportStats from "../components/reports/ReportStats";
import IncomeExpenseChart from "../components/reports/IncomeExpenseChart";
import LivestockChart from "../components/reports/LivestockChart";
import BreedingOverview from "../components/reports/BreedingOverview";
import HealthOverview from "../components/reports/HealthOverview";
import ExportCenter from "../components/reports/ExportCenter";

import { getFarmReport } from "../services/reportService";

export default function Reports() {
  const [report, setReport] = useState({
    totalAnimals: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    animals: [],
    finance: [],
    breeding: [],
    health: [],
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

      <LivestockChart
        animals={report.animals}
      />

      <BreedingOverview
        records={report.breeding}
      />

      <HealthOverview
        records={report.health}
      />

      <ExportCenter
        report={report}
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
          🚀 Coming Soon
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
            <h3>📄 Export Reports</h3>
            <ul>
              <li>PDF Export</li>
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
