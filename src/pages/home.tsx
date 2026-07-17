import React from "react";
import { useLocation } from "wouter";
import { PlannerForm, PlannerFormValues } from "@/components/planner-form";
import { useListDestinations, useGetTripStats } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Globe, Compass, Wallet, Star, Quote, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: destinations, isLoading: isLoadingDestinations } = useListDestinations();
  const { data: stats } = useGetTripStats();

  const handlePlanSubmit = (data: PlannerFormValues) => {
    const searchParams = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    setLocation(`/plan?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground">
              Design your dream trip in <span className="text-primary italic">seconds</span>, not hours.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the world with TripGeniee. Our AI crafts hyper-personalized, day-by-day itineraries tailored to your unique travel style and budget.
            </p>
            
            <div className="bg-card/80 backdrop-blur-xl border p-6 md:p-8 rounded-2xl shadow-xl mt-12 text-left">
              <PlannerForm onSubmit={handlePlanSubmit} variant="horizontal" />
            </div>
            
            {stats && (
              <div className="flex items-center justify-center gap-8 mt-12 pt-8 text-sm text-muted-foreground font-medium">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-foreground">{stats.totalTrips.toLocaleString()}</span>
                  <span>Trips Planned</span>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-foreground">{stats.totalDestinations.toLocaleString()}</span>
                  <span>Destinations</span>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-foreground">{stats.totalDaysPlanned?.toLocaleString() || "100k+"}</span>
                  <span>Days Explored</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Trending Destinations</h2>
            <p className="text-muted-foreground max-w-2xl">Discover where travelers are heading this season. Our AI has generated thousands of unique plans for these iconic locations.</p>
          </div>

          {isLoadingDestinations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations?.slice(0, 6).map(dest => (
                <div key={dest.id} className="group relative overflow-hidden rounded-xl border bg-card hover-elevate transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={dest.imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(dest.name)}`} 
                      alt={dest.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold font-serif">{dest.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {dest.country}
                        </p>
                      </div>
                      {dest.rating && (
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                          <Star className="w-3 h-3 fill-current" /> {dest.rating}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-4">{dest.description}</p>
                    <div className="flex items-center gap-2 mt-6">
                      <button 
                        onClick={() => handlePlanSubmit({ destination: dest.name, days: 5, budget: dest.avgBudgetPerDay * 5, travelStyle: "comfort" })}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        Plan a trip here <Compass className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Everything you need for the perfect journey.</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg h-fit text-primary">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Hyper-Personalized Itineraries</h3>
                    <p className="text-muted-foreground">Our AI considers your budget, group size, and travel style to build day-by-day plans that feel hand-crafted by a local expert.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg h-fit text-primary">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Smart Budgeting</h3>
                    <p className="text-muted-foreground">Get a clear breakdown of estimated costs for accommodation, transport, food, and activities before you book anything.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg h-fit text-primary">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Curated Attractions & Hotels</h3>
                    <p className="text-muted-foreground">Skip the endless review reading. We surface the best places to stay and things to do that match your specific vibe.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-50 rounded-full"></div>
              <div className="relative bg-card border rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6 border-b pb-6">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <span className="font-serif font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Arrival in Kyoto</h4>
                    <p className="text-sm text-muted-foreground">Day 1 • Cultural Focus</p>
                  </div>
                </div>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-[3px] md:ml-0">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-lg border bg-card shadow-sm">
                      <p className="font-medium text-sm">10:00 AM</p>
                      <p className="font-bold mt-1">Fushimi Inari Taisha</p>
                      <p className="text-xs text-muted-foreground mt-2">Hike through thousands of vibrant vermilion torii gates.</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-muted bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-[3px] md:ml-0"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-lg border bg-card shadow-sm">
                      <p className="font-medium text-sm">1:00 PM</p>
                      <p className="font-bold mt-1">Lunch at Nishiki Market</p>
                      <p className="text-xs text-muted-foreground mt-2">Sample local street food like tamagoyaki and takoyaki.</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-muted bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-[3px] md:ml-0"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-lg border bg-card shadow-sm">
                      <p className="font-medium text-sm">3:30 PM</p>
                      <p className="font-bold mt-1">Kiyomizu-dera Temple</p>
                      <p className="text-xs text-muted-foreground mt-2">Iconic wooden temple offering sweeping city views.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Travelers Love TripGeniee</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary-foreground/10 p-8 rounded-2xl backdrop-blur-sm border border-primary-foreground/20">
              <Quote className="w-8 h-8 opacity-50 mb-4" />
              <p className="text-lg mb-6 leading-relaxed">"Planned a 2-week honeymoon in Italy in literally 5 minutes. The hotel recommendations were spot on for our budget, and the daily pacing was perfect."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold">SM</div>
                <div>
                  <p className="font-bold">Sarah M.</p>
                  <p className="text-sm opacity-80">Honeymooner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-foreground/10 p-8 rounded-2xl backdrop-blur-sm border border-primary-foreground/20">
              <Quote className="w-8 h-8 opacity-50 mb-4" />
              <p className="text-lg mb-6 leading-relaxed">"I travel for work and usually just wing it on weekends. Now I use this to generate weekend itineraries. It finds the weird, cool local spots I'd never find alone."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold">JD</div>
                <div>
                  <p className="font-bold">James D.</p>
                  <p className="text-sm opacity-80">Digital Nomad</p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-foreground/10 p-8 rounded-2xl backdrop-blur-sm border border-primary-foreground/20">
              <Quote className="w-8 h-8 opacity-50 mb-4" />
              <p className="text-lg mb-6 leading-relaxed">"The budget breakdown feature is a lifesaver. It showed us we were underestimating transport costs in Switzerland before we even booked our flights."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold">AT</div>
                <div>
                  <p className="font-bold">Alex & Taylor</p>
                  <p className="text-sm opacity-80">Budget Travelers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl">Start planning for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold font-serif mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">Perfect for weekend getaways.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <span>3 AI trip generations per month</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <span>Basic day-by-day itineraries</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <span>Standard budget estimations</span></li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>
            
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold font-serif mb-2">Pro</h3>
              <p className="text-primary-foreground/80 mb-6">For the avid traveler.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-primary-foreground/80">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-accent" /> <span>Unlimited AI trip generations</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-accent" /> <span>Hyper-personalized itineraries</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-accent" /> <span>Advanced budget tools</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-accent" /> <span>Save & export to PDF</span></li>
              </ul>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Go Pro</Button>
            </div>
            
            <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold font-serif mb-2">Team</h3>
              <p className="text-muted-foreground mb-6">For travel agents & agencies.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <span>Everything in Pro</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <span>Custom branding on exports</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <span>Client collaboration tools</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <span>Priority support</span></li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border p-4 shadow-sm">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold text-lg">How does the AI create the itinerary?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Our AI analyzes millions of data points including travel blogs, review sites, weather patterns, and local pricing. It takes your specific constraints (budget, days, group size) and generates a realistic, logically-paced daily schedule.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold text-lg">Are the budget estimates accurate?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Yes, we constantly update our pricing models based on current economic data for each region. However, these are estimates intended for planning purposes. Flight costs are excluded as they vary wildly based on origin.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold text-lg">Can I modify a generated trip?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Currently, you can save and view your trips. Full editing capabilities (like swapping out specific hotels or changing activity times) are coming in our next major update for Pro users.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-semibold text-lg">Do you actually book the hotels and flights for me?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                TripGeniee is a planning tool, not a booking agency. We provide the ideal blueprint, allowing you to use your preferred booking platforms to finalize the reservations when you're ready.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
