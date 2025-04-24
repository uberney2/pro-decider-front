import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../service/accountService';
import { getProjects } from '../../service/projectService';
import { Account } from '../../types/Account';
import { Project, ProjectStatus } from '../../types/Project';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend as ReLegend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import styles from './Dashboard.module.css';

const COLORS = ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E', '#2196F3'];

// Formateador de moneda USD
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAccounts(), getProjects()])
      .then(([accs, projs]) => {
        setAccounts(accs);
        setProjects(projs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalAccounts = accounts.length;
  const totalProjects = projects.length;
  const avgBilling =
    projects.reduce((sum, p) => sum + Number(p.averageBillingRate || 0), 0) /
    (totalProjects || 1);

 
  const accountsByStatus = Object.entries(
    accounts.reduce<Record<string, number>>((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const projectsByStatus = Object.values(ProjectStatus).map((status) => ({
    status,
    count: projects.filter((p) => p.status === status).length,
  }));

  const projectsPieData = projectsByStatus.map(({ status, count }) => ({
    name: status,
    value: count,
  }));

  const revenueByMonth: Record<string, number> = {};
  projects.forEach((p) => {
    if (p.pursuitStartDate && p.latamRevenue) {
      const month = new Date(p.pursuitStartDate).toLocaleString('es-CO', {
        month: 'short',
        year: 'numeric',
      });
      revenueByMonth[month] =
        (revenueByMonth[month] || 0) + Number(p.latamRevenue);
    }
  });
  const lineData = Object.entries(revenueByMonth)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, revenue]) => ({ month, revenue }));

  if (loading)
    return <div className={styles.loading}>Cargando datos...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard</h2>

      {/* Tarjetas */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total accounts</h3>
          <p>{totalAccounts}</p>
        </div>
        <div className={styles.card}>
          <h3>Total pursuits</h3>
          <p>{totalProjects}</p>
        </div>
        <div className={styles.card}>
          <h3>total Average Billing Rate</h3>
          <p>{usdFormatter.format(avgBilling)}</p>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chart}>
          <h4>Projects by state (count)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={projectsByStatus}>
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <ReTooltip
                formatter={(value: number) => `${value} proyectos`}
              />
              <Bar dataKey="count" fill="#3f51b5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chart}>
          <h4>Projects by state (%)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={projectsPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {projectsPieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[(i + 1) % COLORS.length]}
                  />
                ))}
              </Pie>
              <ReTooltip
                formatter={(value: number, name: string) => {
                  const pct = ((value / totalProjects) * 100).toFixed(0);
                  return [`${pct}% (${value})`, name];
                }}
              />
              <ReLegend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {lineData.length > 0 && (
          <div className={styles.chart}>
            <h4>Ingresos LATAM por mes</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip
                  formatter={(value: number) =>
                    `$${value.toLocaleString()}`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#e91e63"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
