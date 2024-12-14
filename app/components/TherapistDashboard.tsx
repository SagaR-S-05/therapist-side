'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Patient {
  id: string;
  name: string;
  lastSession: string;
  nextAppointment: string;
  status: 'Active' | 'Inactive';
  mentalHealthMetrics: {
    anxiety: number[];
    happiness: number[];
  };
  summaryText: string;
  scores: { anxiety: number; happiness: number }; // To store fetched scores
}

const TherapistDashboard: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null); // Only one patient
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patient data (summary and scores) from the backend
  const fetchPatientData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/summarize_journal'); // API endpoint
      const data = response.data;

      const fetchedPatient: Patient = {
        id: '1', // Static ID for now
        name: 'Emily Johnson', // Static name for display
        lastSession: '2024-12-13',
        nextAppointment: '2024-12-20',
        status: 'Active',
        mentalHealthMetrics: {
          anxiety: data.chartData.map((item: any) => item.Anxiety), // Anxiety data for chart
          happiness: data.chartData.map((item: any) => item.Happiness), // Happiness data for chart
        },
        summaryText: data.summaries.join(' '), // Concatenate all summaries
        scores: data.scores, // Individual scores
      };

      setPatient(fetchedPatient);
    } catch (err) {
      setError('Failed to fetch patient data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []); // Fetch data on component mount

  // Transform data for recharts
  const formatChartData = (patient: Patient) => {
    return patient.mentalHealthMetrics.anxiety.map((anxiety, index) => ({
      session: `Session ${index + 1}`,
      Anxiety: anxiety,
      Happiness: patient.mentalHealthMetrics.happiness[index],
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Therapist Dashboard</h1>

      <div className="grid grid-cols-1 gap-4">
        {/* Patient Summary Section */}
        {patient && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Summary: {patient.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Text Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Progress Summary</h3>
                  <p className="text-gray-700">{patient.summaryText}</p>

                  <div className="mt-4">
                    <h4 className="font-medium">Key Observations:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      <li>Next Appointment: {patient.nextAppointment}</li>
                      <li>Current Status: {patient.status}</li>
                      <li>Anxiety Score: {patient.scores.anxiety}</li>
                      <li>Happiness Score: {patient.scores.happiness}</li>
                    </ul>
                  </div>
                </div>

                {/* Mental Health Metrics Graph */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mental Health Metrics</h3>
                  <LineChart width={400} height={300} data={formatChartData(patient)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Anxiety"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="Happiness" stroke="#82ca9d" />
                  </LineChart>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;
