"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

interface FeaturedCardProps {
  title: string;
  description: string;
  features: string[];
  popular?: boolean;
  onLearnMore?: () => void;
}

export function FeaturedCard({ 
  title, 
  description, 
  features, 
  popular = false,
  onLearnMore 
}: FeaturedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${
        popular ? 'ring-2 ring-primary' : ''
      } ${isHovered ? 'shadow-lg scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {popular && (
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="bg-primary">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Recursos:</h4>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onLearnMore}
          >
            Saiba Mais
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}