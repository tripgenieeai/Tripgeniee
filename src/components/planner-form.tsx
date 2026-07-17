import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Plane, Sparkles } from "lucide-react";
import { TripRequestTravelStyle } from "@/lib/api-client";

export const plannerFormSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  days: z.number().min(1).max(30),
  budget: z.number().min(100, "Minimum budget is $100"),
  travelStyle: z.nativeEnum(TripRequestTravelStyle),
});

export type PlannerFormValues = z.infer<typeof plannerFormSchema>;

interface PlannerFormProps {
  defaultValues?: Partial<PlannerFormValues>;
  onSubmit: (data: PlannerFormValues) => void;
  isLoading?: boolean;
  variant?: "horizontal" | "vertical";
}

export function PlannerForm({ defaultValues, onSubmit, isLoading, variant = "horizontal" }: PlannerFormProps) {
  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      destination: defaultValues?.destination || "",
      days: defaultValues?.days || 5,
      budget: defaultValues?.budget || 1500,
      travelStyle: defaultValues?.travelStyle || "comfort",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`gap-4 ${variant === "horizontal" ? "md:flex md:items-end grid grid-cols-1 sm:grid-cols-2" : "flex flex-col"}`}>
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem className={variant === "horizontal" ? "flex-1" : ""}>
              <FormLabel>Where to?</FormLabel>
              <FormControl>
                <div className="relative">
                  <Plane className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tokyo, Japan" className="pl-9" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem className={variant === "horizontal" ? "w-full md:w-32" : ""}>
              <FormLabel>Duration: {field.value} days</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  value={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                  className="py-3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem className={variant === "horizontal" ? "w-full md:w-32" : ""}>
              <FormLabel>Budget ($)</FormLabel>
              <FormControl>
                <Input type="number" min={100} step={100} {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="travelStyle"
          render={({ field }) => (
            <FormItem className={variant === "horizontal" ? "w-full md:w-40" : ""}>
              <FormLabel>Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(TripRequestTravelStyle).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={isLoading} className={variant === "horizontal" ? "w-full md:w-auto" : "w-full mt-2"}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Trip
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
