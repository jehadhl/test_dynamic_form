import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";

export const useDynamicForm = (formData, formSchema, router) => {
  const { toast } = useToast();
  const [showPreferredContact, setShowPreferredContact] = useState(false);
  const [fieldInteractions, setFieldInteractions] = useState({});

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

  const ageValue = watch("age_12345");

  // Update visibility of preferred contact method
  useEffect(() => {
    if (ageValue > 18) {
      setShowPreferredContact(true);
    } else {
      setShowPreferredContact(false);
      setValue("contact_method", "");
    }
  }, [ageValue, setValue]);

  // Track field interactions
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
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.request?.message ||
        "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      });
      reset();
    },
  });

  const onSubmit = (data) => {
    if (ageValue <= 18) {
      delete data.contact_method;
    }
    mutation.mutate(data);
  };

  const handleReset = () => {
    reset();
    setFieldInteractions({});
  };

  return {
    form,
    fieldInteractions,
    showPreferredContact,
    handleSubmit,
    handleReset,
    onSubmit,
    mutation,
  };
};
