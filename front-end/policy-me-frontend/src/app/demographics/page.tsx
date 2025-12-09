'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { User, MapPin, DollarSign, GraduationCap, Shield, Briefcase, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { useUser } from '@/context/UserProvider';
import { Demographics } from '@/types';
import { getErrorMessage } from '@/lib/error-handler';
import { toast } from 'sonner';



export default function DemographicsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { setDemographic } = useUser();
  const [saved, setSaved] = useState(false);
  
  const [form, setForm] = useState<Demographics>({
    age: null,
    state: '',
    incomeBracket: '',
    veteran: false,
    student: false,
    smallBusinessOwner: false,
    zip: 63021,
  });

  // Load saved demographics on mount
  useEffect(() => {
    const savedDemo = localStorage.getItem('demographics');
    if (savedDemo) {
      try {
        setForm(JSON.parse(savedDemo));
      } catch (e) {
        console.error('Failed to parse saved demographics:', e);
        // Clear invalid data
        localStorage.removeItem('demographics');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'age') {
      setForm((prev) => ({ ...prev, [name]: value ? parseInt(value) : null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setSaved(false);
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validate required fields
      if (!form.state || !form.incomeBracket) {
        const errorMsg = 'Please fill in all required fields (State and Income Bracket).';
        toast.error(errorMsg);
        return;
      }

      try {
        // Save to localStorage first for immediate feedback
        localStorage.setItem('demographics', JSON.stringify(form));
        setSaved(true);

        // Then save to backend
        await setDemographic(form);
        
        // Redirect after successful save
        setTimeout(() => router.push('/'), 1500);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Failed to save demographics to backend:', error);
        toast.error(errorMessage);
        setSaved(false);
        // Don't redirect on error - let user try again
      }
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: '#00132B' }}>
              <User className="w-8 h-8" style={{ color: '#DFE4EA' }} />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground">
              Help us personalize policy impacts for you
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Age & State Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Age
                  </label>
                  <Input
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={form.age ?? ''}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                {/* ZIP Code */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  ZIP Code
                </label>
                <Input
                  name="zip"
                  type="text"
                  placeholder="Enter your ZIP code"
                  value={form.zip}
                  onChange={handleChange}
                  maxLength={5}
                  className="w-full max-w-xs"
                />
              </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    State
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Income Bracket */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Income Bracket
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'low', label: 'Under $50K', desc: 'Low income' },
                    { value: 'middle', label: '$50K - $150K', desc: 'Middle income' },
                    { value: 'high', label: 'Over $150K', desc: 'High income' },
                  ].map((bracket) => (
                    <label
                      key={bracket.value}
                      className={`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        form.incomeBracket === bracket.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="incomeBracket"
                        value={bracket.value}
                        checked={form.incomeBracket === bracket.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{bracket.label}</span>
                      <span className="text-xs text-muted-foreground">{bracket.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Status (check all that apply)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      form.student ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="student"
                      checked={form.student}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <GraduationCap className={`w-5 h-5 ${form.student ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Student</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      form.veteran ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="veteran"
                      checked={form.veteran}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Shield className={`w-5 h-5 ${form.veteran ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Veteran</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      form.smallBusinessOwner ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="smallBusinessOwner"
                      checked={form.smallBusinessOwner}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Briefcase className={`w-5 h-5 ${form.smallBusinessOwner ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Small Biz</span>
                  </label>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Why we ask:</strong> This helps us show how policies specifically impact people like you. Your data stays on your device.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: saved ? '#22c55e' : '#00132B' }}
              >
                {saved ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Saved! Redirecting...
                  </span>
                ) : (
                  'Save Profile'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
