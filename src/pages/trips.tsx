import React from "react";
import { Link, useLocation } from "wouter";
import { useListTrips, useDeleteTrip, getListTripsQueryKey } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { MapPin, Calendar, DollarSign, Trash2, ArrowRight } from "lucide-react";
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

export default function Trips() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: trips, isLoading } = useListTrips();
  const deleteTrip = useDeleteTrip();

  const handleDelete = (id: number) => {
    deleteTrip.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Trip deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
      },
      onError: () => {
        toast({ 
          variant: "destructive",
          title: "Failed to delete trip" 
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold">Saved Trips</h1>
          <p className="text-muted-foreground mt-2">Your personal library of adventures waiting to happen.</p>
        </div>
        <Button onClick={() => setLocation("/plan")} className="shrink-0">
          Plan New Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : trips && trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip.id} className="group hover:border-primary/50 transition-colors flex flex-col h-full overflow-hidden hover-elevate">
              <div className="h-3 bg-gradient-to-r from-primary to-accent w-full"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-serif text-2xl truncate pr-4">{trip.destination}</CardTitle>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full whitespace-nowrap capitalize border">
                    {trip.travelStyle}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Created {format(new Date(trip.createdAt), "MMM d, yyyy")}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{trip.days} Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{trip.budget} {trip.currency || "USD"}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {trip.plan.summary}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t bg-muted/20">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your trip plan to {trip.destination}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(trip.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button variant="secondary" onClick={() => setLocation(`/trips/${trip.id}`)}>
                  View Details <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card border rounded-2xl border-dashed">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2">No trips planned yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Your travel library is empty. Let our AI craft the perfect itinerary for your next adventure.
          </p>
          <Button onClick={() => setLocation("/plan")} size="lg">
            Start Planning
          </Button>
        </div>
      )}
    </div>
  );
}
