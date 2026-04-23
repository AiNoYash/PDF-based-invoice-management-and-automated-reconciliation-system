import React from 'react';
import './DashboardPage.css';

/* SVG Icons */
const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

const TrendingDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

/* Mock Data (mirrors schema.sql tables) */
const latestMonthStats = {
  month: "January 2025",
  total_records: 342,
  exact_matches: 198,
  partial_matches: 47,
  manual_matches: 23,
  unmatched: 74,
};

const overallStats = {
  total_records_processed: 6000,
  all_time_exact: 4120,
  all_time_partial: 890,
  all_time_manual: 340,
  all_time_unmatched: 650,
};

const recentMatches = [
  { id: 1, transaction_id: "TXN-2025-001884", transaction_type: "Debit", amount: 42500, match_type: "exact", match_date: "2025-01-28" },
  { id: 2, transaction_id: "TXN-2025-001885", transaction_type: "Credit", amount: 18200, match_type: "exact", match_date: "2025-01-28" },
  { id: 3, transaction_id: "TXN-2025-001886", transaction_type: "Debit", amount: 91000, match_type: "partial", match_date: "2025-01-28" },
  { id: 4, transaction_id: "TXN-2025-001887", transaction_type: "Credit", amount: 6750, match_type: "manual", match_date: "2025-01-27" },
  { id: 5, transaction_id: "TXN-2025-001888", transaction_type: "Debit", amount: 125000, match_type: "exact", match_date: "2025-01-27" },
];

/* Helpers */
const formatCurrency = (val) => "Rs." + val.toLocaleString("en-IN");

const pct = (num, den) => den === 0 ? "0.0" : ((num / den) * 100).toFixed(1);

/* Reusable Performance Card */
function PerformanceCard({ title, value, count, total, trend, trendDir, fillClass }) {
  return (
    <div className="overall-stat-card">
      <div className="overall-stat-header">
        <h4>{title}</h4>
        <span className={`overall-stat-trend ${trendDir === 'up' ? 'trend-up' : 'trend-down'}`}>
          {trendDir === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />} {trend}
        </span>
      </div>
      <div className="overall-stat-value">{value}%</div>
      <div className="overall-stat-bar">
        <div className={`overall-stat-bar-fill ${fillClass}`} style={{ width: `${value}%` }} />
      </div>
      <div className="overall-stat-footer">
        {count.toLocaleString("en-IN")} out of {total.toLocaleString("en-IN")} records
      </div>
    </div>
  );
}

/* Component */
export function DashboardPage() {
  const m = latestMonthStats;

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <div className="welcome-banner">
        <h1>Dashboard</h1>
        <p>Overview of your reconciliation activity and performance metrics.</p>
      </div>

      {/* Latest Month Performance */}
      <div className="section-title-row">
        <h2>{m.month} Performance</h2>
        <span className="section-tag">{m.total_records.toLocaleString("en-IN")} records</span>
      </div>

      <div className="overall-stats-grid">
        <PerformanceCard
          title="Exact Match Rate"
          value={pct(m.exact_matches, m.total_records)}
          count={m.exact_matches}
          total={m.total_records}
          trend="+4.2%"
          trendDir="up"
          fillClass="fill-green"
        />
        <PerformanceCard
          title="Partial Match Rate"
          value={pct(m.partial_matches, m.total_records)}
          count={m.partial_matches}
          total={m.total_records}
          trend="-1.3%"
          trendDir="down"
          fillClass="fill-amber"
        />
        <PerformanceCard
          title="Manual Match Rate"
          value={pct(m.manual_matches, m.total_records)}
          count={m.manual_matches}
          total={m.total_records}
          trend="+0.5%"
          trendDir="up"
          fillClass="fill-blue"
        />
        <PerformanceCard
          title="Unmatched Rate"
          value={pct(m.unmatched, m.total_records)}
          count={m.unmatched}
          total={m.total_records}
          trend="-3.4%"
          trendDir="up"
          fillClass="fill-rose"
        />
      </div>

      {/* Overall Reconciliation Performance */}
      <div className="section-title-row">
        <h2>Overall Reconciliation Performance</h2>
        <span className="section-tag">{overallStats.total_records_processed.toLocaleString("en-IN")} records all time</span>
      </div>

      <div className="overall-stats-grid">
        <PerformanceCard
          title="Exact Match Rate"
          value={pct(overallStats.all_time_exact, overallStats.total_records_processed)}
          count={overallStats.all_time_exact}
          total={overallStats.total_records_processed}
          trend="+2.4%"
          trendDir="up"
          fillClass="fill-green"
        />
        <PerformanceCard
          title="Partial Match Rate"
          value={pct(overallStats.all_time_partial, overallStats.total_records_processed)}
          count={overallStats.all_time_partial}
          total={overallStats.total_records_processed}
          trend="-0.8%"
          trendDir="down"
          fillClass="fill-amber"
        />
        <PerformanceCard
          title="Manual Match Rate"
          value={pct(overallStats.all_time_manual, overallStats.total_records_processed)}
          count={overallStats.all_time_manual}
          total={overallStats.total_records_processed}
          trend="+1.1%"
          trendDir="up"
          fillClass="fill-blue"
        />
        <PerformanceCard
          title="Unmatched Rate"
          value={pct(overallStats.all_time_unmatched, overallStats.total_records_processed)}
          count={overallStats.all_time_unmatched}
          total={overallStats.total_records_processed}
          trend="-2.1%"
          trendDir="up"
          fillClass="fill-rose"
        />
      </div>

      {/* Recent Matches Table */}
      <div className="mini-table-wrapper">
        <div className="mini-table-header">
          <h4>Recent Matches</h4>
          <a href="/dashboard/reconciliations">View All <ArrowRightIcon /></a>
        </div>
        <table className="mini-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Match Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentMatches.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.transaction_id}</strong></td>
                <td>{item.transaction_type}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>
                  <span className={`match-type-badge badge-${item.match_type}`}>
                    {item.match_type.charAt(0).toUpperCase() + item.match_type.slice(1)}
                  </span>
                </td>
                <td>{item.match_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
