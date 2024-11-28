"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/validation";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const DynamicForm = ({ formData }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [showPreferredContact, setShowPreferredContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldInteractions, setFieldInteractions] = useState({});

  // manage form state
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData.reduce(
      (acc, field) => {
        acc[field.name] = field.defaultValue || "";
        return acc;
      },
      { contact_method: "" }
    ),
  });

  const { watch, handleSubmit, reset, setValue } = form;

  // handle show contact method
  const ageValue = watch("age_12345");

  useEffect(() => {
    if (ageValue > 18) {
      setShowPreferredContact(true);
    } else {
      setShowPreferredContact(false);

      setValue("contact_method", "");
    }
  }, [ageValue, setValue]);

  //
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/posts", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Submission Successful",
        description: `Post ID: ${data.id}`,
        className: "bg-green-500 text-white",
      });
      router.push(`/posts/1`);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error?.message,
      });
      setIsSubmitting(false);
      reset();
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    if (ageValue <= 18) {
      delete data.contact_method;
    }
    // console.log(data)
    mutation.mutate(data);
  };

  // track interaction
  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name) {
        setFieldInteractions((prev) => ({
          ...prev,
          [name]: (prev[name] || 0) + 1,
        }));
      }
    });

    return () => subscription.unsubscribe?.();
  }, [watch]);

  const handleReset = () => {
    reset();
    setFieldInteractions({});
  };

  //   console.log(mutation.status);

  return (
    <Card className="w-[450px] mt-8">
      <CardHeader>
        <CardTitle>Create Dynamic form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formData.map((field) => (
              <FormItem key={field.name}>
                <FormControl>
                  {/* Input */}
                  {field.variant === "Input" ? (
                    <div className="flex flex-col gap-2">
                      <FormLabel>{field.label}</FormLabel>
                      <Input
                        type={field.type.toLowerCase()}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        {...form.register(field.name, {
                          valueAsNumber: field.type === "Number",
                        })}
                      />
                      <div className="text-sm text-gray-500">
                        {fieldInteractions[field.name]
                          ? `Interactions: ${fieldInteractions[field.name]}`
                          : ""}
                      </div>
                    </div>
                  ) : field.variant === "Checkbox" ? (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        {...form.register(field.name)}
                        onCheckedChange={(val) =>
                          form.setValue(field.name, val)
                        }
                        disabled={field.disabled}
                      />
                      <FormLabel>{field.label}</FormLabel>
                    </div>
                  ) : null}
                </FormControl>
                {form.formState.errors[field.name] && (
                  <FormMessage>
                    {form.formState.errors[field.name]?.message}
                  </FormMessage>
                )}
              </FormItem>
            ))}

            {showPreferredContact && (
              <FormField
                control={form.control}
                name="contact_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Contact Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-500">
                      {fieldInteractions[field.name]
                        ? `Interactions: ${fieldInteractions[field.name]}`
                        : ""}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between items-center">
              <Button variant={"outline"} type="button" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DynamicForm;
