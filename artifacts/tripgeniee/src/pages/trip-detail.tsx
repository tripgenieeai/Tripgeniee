import React from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetTrip, useDeleteTrip, getListTripsQueryKey, getGetTripQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Hotel, Train, Backpack, DollarSign, ArrowLeft, Trash2, MapPin, Map, Sunrise, Cloud } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TripDetail() {
  const params = useParams();
  const tripId = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trip, isLoading, isError } = useGetTrip(tripId, {
    query: { enabled: !!tripId, queryKey: getGetTripQueryKey(tripId) }
  });
  
  const deleteTrip = useDeleteTrip();

  const handleDelete = () => {
    deleteTrip.mutate({ id: tripId }, {
      onSuccess: () => {
        toast({ title: "Trip deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
        setLocation("/trips");
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to delete trip" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-pulse">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-[600px] md:col-span-2 rounded-2xl" />
          <Skeleton className="h-[600px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Trip not found</h2>
        <p className="text-muted-foreground mb-8">This trip may have been deleted or doesn't exist.</p>
        <Button onClick={() => setLocation("/trips")}>Return to My Trips</Button>
      </div>
    );
  }

  const tripPlan = trip.plan;
  const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/trips" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Trips
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your trip plan to {trip.destination}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground mb-8 p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-primary-foreground/10">
              {trip.travelStyle}
            </span>
            <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-primary-foreground/10">
              {trip.days} Days
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4">{trip.destination}</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl leading-relaxed">
            {tripPlan.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Itinerary */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold flex items-center gap-3 border-b pb-4">
              <Map className="w-8 h-8 text-primary" /> The Itinerary
            </h2>
            
            <div className="space-y-12">
              {tripPlan.itinerary.map((day, idx) => (
                <div key={idx} className="relative">
                  <div className="sticky top-20 bg-background/95 backdrop-blur z-10 py-4 mb-4 border-b">
                    <h3 className="font-bold text-2xl font-serif flex items-center gap-3">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-base">
                        {day.day}
                      </span>
                      {day.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-6 pl-4 md:pl-14">
                    {day.activities.map((activity, aIdx) => (
                      <div key={aIdx} className="group relative bg-card border rounded-xl p-5 hover-elevate transition-all">
                        <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-muted border-4 border-background group-hover:border-primary/20 transition-colors hidden md:block"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                          <div>
                            <span className="text-sm font-bold text-primary mb-1 block">{activity.time}</span>
                            <h4 className="font-bold text-lg">{activity.name}</h4>
                          </div>
                          {activity.estimatedCost && (
                            <span className="shrink-0 bg-muted px-3 py-1 rounded-md text-sm font-semibold border">
                              ${activity.estimatedCost}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Weather & Info */}
          <Card className="bg-muted/30 border-muted">
            <CardContent className="pt-6 space-y-4">
              {tripPlan.bestTimeToVisit && (
                <div className="flex gap-4">
                  <div className="bg-background p-2 rounded-lg h-fit border shadow-sm"><Sunrise className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="font-semibold">Best Time to Visit</p>
                    <p className="text-sm text-muted-foreground mt-1">{tripPlan.bestTimeToVisit}</p>
                  </div>
                </div>
              )}
              {tripPlan.weather && (
                <div className="flex gap-4">
                  <div className="bg-background p-2 rounded-lg h-fit border shadow-sm"><Cloud className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="font-semibold">Typical Weather</p>
                    <p className="text-sm text-muted-foreground mt-1">{tripPlan.weather}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Breakdown */}
          <Card>
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl font-serif flex items-center justify-between">
                <span>Budget</span>
                <span className="text-primary">${tripPlan.budgetBreakdown.total}</span>
              </CardTitle>
              <CardDescription>Estimated cost in {tripPlan.budgetBreakdown.currency || trip.currency || "USD"}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Stay', value: tripPlan.budgetBreakdown.accommodation },
                        { name: 'Travel', value: tripPlan.budgetBreakdown.transport },
                        { name: 'Food', value: tripPlan.budgetBreakdown.food },
                        { name: 'Fun', value: tripPlan.budgetBreakdown.activities },
                        { name: 'Misc', value: tripPlan.budgetBreakdown.miscellaneous },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {CHART_COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: CHART_COLORS[0]}}></div>Accommodation</span> <span className="font-medium">${tripPlan.budgetBreakdown.accommodation}</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: CHART_COLORS[1]}}></div>Transport</span> <span className="font-medium">${tripPlan.budgetBreakdown.transport}</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: CHART_COLORS[2]}}></div>Food</span> <span className="font-medium">${tripPlan.budgetBreakdown.food}</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: CHART_COLORS[3]}}></div>Activities</span> <span className="font-medium">${tripPlan.budgetBreakdown.activities}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Details Tabs */}
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <Tabs defaultValue="hotels" className="w-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none border-b h-14 bg-muted/20">
                <TabsTrigger value="hotels" className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none"><Hotel className="w-4 h-4 mr-2" /> Stay</TabsTrigger>
                <TabsTrigger value="transport" className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none"><Train className="w-4 h-4 mr-2" /> Travel</TabsTrigger>
                <TabsTrigger value="packing" className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none"><Backpack className="w-4 h-4 mr-2" /> Pack</TabsTrigger>
              </TabsList>
              
              <div className="p-4 bg-background max-h-[600px] overflow-y-auto custom-scrollbar">
                <TabsContent value="hotels" className="space-y-4 m-0">
                  {tripPlan.hotels.map((hotel, idx) => (
                    <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold">{hotel.name}</h4>
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">${hotel.pricePerNight}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{hotel.description}</p>
                      {hotel.amenities && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {hotel.amenities.map((amenity, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider bg-muted px-2 py-1 rounded-sm text-muted-foreground">{amenity}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="transport" className="space-y-4 m-0">
                  {tripPlan.transport.map((t, idx) => (
                    <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold capitalize flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Train className="w-4 h-4 text-primary" />
                          </div>
                          {t.type}
                        </h4>
                        <span className="text-sm font-bold">${t.estimatedCost}</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-10">{t.description}</p>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="packing" className="space-y-6 m-0">
                  {tripPlan.packingList.map((category, idx) => (
                    <div key={idx}>
                      <h4 className="font-bold text-sm text-primary uppercase tracking-wider mb-3 pb-1 border-b inline-block">{category.category}</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {category.items.map((item, i) => (
                          <li key={i} className="text-sm flex items-center gap-2 text-muted-foreground before:w-1.5 before:h-1.5 before:bg-muted-foreground/30 before:rounded-full">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
