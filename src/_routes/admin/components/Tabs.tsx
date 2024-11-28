import React from "react";
import {
  Tabs as UITabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type Tab = {
  label: string;
  value: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultValue?: string;
};

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultValue }) => {
  return (
    <UITabs
      defaultValue={defaultValue || tabs[0]?.value}
      className="w-full h-full flex flex-col justify-cent mx-auto"
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="" >
          {tab.content}
        </TabsContent>
      ))}
    </UITabs>
  );
};
