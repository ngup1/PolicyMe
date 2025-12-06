'use client';
import { useState } from 'react';

export default function DemographicsPage() {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    income: 50000,
    state: '',
    student: 'no',
    veteran: 'no',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Demographic Data:', form);
    alert('Demographic information submitted!');
  };

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming',
  ];

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-6 text-black">
        Demographic Information
      </h1>

      <form onSubmit={handleSubmit} className="w-96 space-y-5">
        {/* Age */}
        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
          className="border w-full p-2 rounded font-serif text-gray-800"
        />

        {/* Gender dropdown */}
        <select
          name="gender"
          onChange={handleChange}
          className="border w-full p-2 rounded font-serif text-gray-800"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nonbinary">Non-binary</option>
          <option value="preferNot">Prefer not to say</option>
        </select>

        {/* Income slider */}
        <div className="font-serif text-gray-800">
          <label htmlFor="income" className="block mb-1">
            Income Bracket: ${form.income.toLocaleString()}
          </label>
          <input
            type="range"
            name="income"
            id="income"
            min="20000"
            max="200000"
            step="10000"
            value={form.income}
            onChange={handleChange}
            className="w-full accent-gray-800"
          />
        </div>

        {/* State dropdown */}
        <select
          name="state"
          onChange={handleChange}
          className="border w-full p-2 rounded font-serif text-gray-800"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* Student status */}
        <select
          name="student"
          onChange={handleChange}
          className="border w-full p-2 rounded font-serif text-gray-800"
        >
          <option value="no">Student: No</option>
          <option value="yes">Student: Yes</option>
        </select>

        {/* Veteran status */}
        <select
          name="veteran"
          onChange={handleChange}
          className="border w-full p-2 rounded font-serif text-gray-800"
        >
          <option value="no">Veteran: No</option>
          <option value="yes">Veteran: Yes</option>
        </select>

        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded w-full font-serif hover:bg-gray-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}


