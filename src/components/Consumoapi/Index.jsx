import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Index = () => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "https://randomuser.me/api/?results=1000"; // Fetching more users for better data representation

    setLoading(true);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDatos(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

  }, []);

  // Gender Data
  const genderData = datos && [
    { name: 'Male', value: datos.filter(user => user.gender === 'male').length },
    { name: 'Female', value: datos.filter(user => user.gender === 'female').length }
  ];

  // Age Data
  const ageData = datos && datos.reduce((acc, user) => {
    const age = user.dob.age;
    const ageGroup = Math.floor(age / 10) * 10; // Group ages into decades
    if (!acc[ageGroup]) {
      acc[ageGroup] = 0;
    }
    acc[ageGroup]++;
    return acc;
  }, {});

  const ageChartData = ageData && Object.keys(ageData).map(ageGroup => ({
    ageGroup: `${ageGroup}s`,
    count: ageData[ageGroup]
  }));

  // Country Data
  const countryData = datos && datos.reduce((acc, user) => {
    const country = user.location.country;
    if (!acc[country]) {
      acc[country] = 0;
    }
    acc[country]++;
    return acc;
  }, {});

  const countryList = countryData && Object.keys(countryData).map(country => ({
    country,
    count: countryData[country]
  }));

  // Registration Year Data
  const yearData = datos && datos.reduce((acc, user) => {
    const year = new Date(user.registered.date).getFullYear();
    if (!acc[year]) {
      acc[year] = 0;
    }
    acc[year]++;
    return acc;
  }, {});

  const yearChartData = yearData && Object.keys(yearData).map(year => ({
    year,
    count: yearData[year]
  }));

  return (
    <div>
    
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          {/* Gender Bar Chart */}
          <h2>Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          {/* Age Histogram */}
          <h2>Age Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>

          {/* Country List */}
          <h2>Users by Country</h2>
          <ul>
            {countryList.map((country, index) => (
              <li key={index}>{country.country}: {country.count}</li>
            ))}
          </ul>

          {/* Registration Year Line Chart */}
          <h2>Users Registered by Year</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Index;
