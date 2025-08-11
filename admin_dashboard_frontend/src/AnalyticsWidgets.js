import React from 'react';

/**
 * Placeholder function to fetch analytics data.
 * Replace this with real API/data source integration.
 * Returns a Promise resolving to mock data.
 * Example: fetchAnalyticsData().then(data => ...)
 */
export async function fetchAnalyticsData() {
  // TODO: Integrate real analytics API here
  // For now, return mock data
  return {
    emojiUsageCounts: [
      { icon: "😂", label: "Joy", value: 1287 },
      { icon: "😍", label: "Love", value: 964 },
      { icon: "😢", label: "Sadness", value: 412 },
      { icon: "😱", label: "Fear", value: 301 },
    ],
    chartPoints: [7, 10, 5, 17, 13, 12, 17, 10, 20, 16, 23, 19],
  };
}

/**
 * MiniChart renders a simple trend/area chart from point data.
 * @param {Object} props
 * @param {number[]} props.points
 * @param {string} props.color
 * @param {string} props.fill
 * @param {number} props.height
 */
export function MiniChart({ points = [7, 4, 9, 5, 13, 12, 11], color = "#e50914", fill = "#e5091433", height = 60 }) {
  const width = 120;
  const domainY = [0, Math.max(...points, 1)];
  const h = height;
  const step = width / (points.length - 1);
  const valueToY = v => h - ((v - domainY[0]) / (domainY[1] - domainY[0]) * h);
  const pointStr = points.map((v, i) => `${i * step},${valueToY(v)}`).join(" ");
  const areaStr = `${points.map((v, i) => `${i*step},${valueToY(v)}`).join(" ")} ${width},${h} 0,${h}`;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ display: "block" }}>
      <polyline fill={fill} stroke="none" points={areaStr} />
      <polyline fill="none" stroke={color} strokeWidth="3" points={pointStr} />
      <circle r={4} fill={color} cx={width} cy={valueToY(points[points.length - 1])} />
    </svg>
  );
}

/**
 * AnalyticsStatsCard modular widget for emoji usage statistics.
 * @param {Object} props
 * @param {Array} props.emojiUsageCounts
 */
export function AnalyticsStatsCard({ emojiUsageCounts }) {
  return (
    <div className="analytics-card stats-card">
      <div className="analytics-card-header">
        <span role="img" aria-label="global" style={{ fontSize: 18, marginRight: 6 }}>🌎</span>
        Global Emotions
      </div>
      <div className="analytics-card-body analytics-stats-flex">
        {emojiUsageCounts.map(e => (
          <div className="analytics-stat" key={e.label}>
            <span className="analytics-stat-icon" style={{ fontSize: "1.7em" }}>{e.icon}</span>
            <div className="analytics-stat-value" style={{ color: "#fff" }}>{e.value}</div>
            <div className="analytics-stat-label">{e.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * AnalyticsTrendCard modular widget for trending/line chart.
 * @param {Object} props
 * @param {number[]} props.chartPoints
 */
export function AnalyticsTrendCard({ chartPoints }) {
  return (
    <div className="analytics-card chart-card">
      <div className="analytics-card-header">
        <span role="img" aria-label="trending" style={{ fontSize: 22, marginRight: 8 }}>📈</span>
        Weekly Emoji Reaction Trend
      </div>
      <div className="analytics-card-body">
        <MiniChart points={chartPoints} color="#e50914" fill="#e5091427" />
        <div className="analytics-label-row">
          <span style={{ fontSize: 10, color: "#e50914", fontWeight: 600 }}>Sun</span>
          <span style={{ fontSize: 10 }}>Mon</span>
          <span style={{ fontSize: 10 }}>Tue</span>
          <span style={{ fontSize: 10 }}>Wed</span>
          <span style={{ fontSize: 10 }}>Thu</span>
          <span style={{ fontSize: 10 }}>Fri</span>
          <span style={{ fontSize: 10 }}>Sat</span>
        </div>
      </div>
    </div>
  );
}

/**
 * AnalyticsWidgetGrid: main section rendering analytics cards.
 * Hooks for real analytic data integration are declared.
 * This component calls fetchAnalyticsData (replace with real impl) – can be connected to backend/API in the future.
 */
export function AnalyticsWidgetGrid() {
  const [usageCounts, setUsageCounts] = React.useState([]);
  const [trendPoints, setTrendPoints] = React.useState([]);
  // Placeholder: Fetch demo data, ready for real API
  React.useEffect(() => {
    fetchAnalyticsData().then(data => {
      setUsageCounts(data.emojiUsageCounts);
      setTrendPoints(data.chartPoints);
    });
  }, []);
  return (
    <section className="analytics-widget-area">
      <div className="analytics-widget-row">
        <AnalyticsTrendCard chartPoints={trendPoints} />
        <AnalyticsStatsCard emojiUsageCounts={usageCounts} />
      </div>
    </section>
  );
}
