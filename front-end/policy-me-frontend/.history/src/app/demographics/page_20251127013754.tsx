'use client';

import { useState } from 'react';
import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DemographicsPage() {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    income: 50000,
    state: '',
    student: 'no',
    veteran: 'no',
  });

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    <>
      <Header />

      <div className="flex justify-center py-12 bg-background min-h-[calc(100vh-6rem)]">
        <Card className="w-full max-w-md p-6 space-y-6 shadow-lg">
          <h1 className="text-2xl font-bold tracking-tight text-center">Demographic Information</h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Age */}
            <div className="space-y-1">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(value) => handleChange('gender', value)}
                value={form.gender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="nonbinary">Non-binary</SelectItem>
                  <SelectItem value="preferNot">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Income */}
            <div className="space-y-1">
              <Label htmlFor="income">Income Bracket: ${form.income.toLocaleString()}</Label>
              <Slider
                id="income"
                value={[form.income]}
                min={20000}
                max={200000}
                step={10000}
                onValueChange={(val) => handleChange('income', val[0])}
              />
            </div>

            {/* State */}
            <div className="space-y-1">
              <Label htmlFor="state">State</Label>
              <Select
                onValueChange={(value) => handleChange('state', value)}
                value={form.state}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student */}
            <div className="space-y-1">
              <Label htmlFor="student">Student</Label>
              <Select
                onValueChange={(value) => handleChange('student', value)}
                value={form.student}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Student status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Veteran */}
            <div className="space-y-1">
              <Label htmlFor="veteran">Veteran</Label>
              <Select
                onValueChange={(value) => handleChange('veteran', value)}
                value={form.veteran}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Veteran status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Card>
      </div>

      <Footer />
    </>
  );
}
