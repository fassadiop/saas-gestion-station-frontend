"use client";

type Props = {
  data: {
    label: string;
    value: number;
  }[];
};

export default function TopServicesChart({ data }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-background">
      <h3 className="text-sm font-medium mb-4">
        Répartition des services
      </h3>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-2 bg-muted rounded">
              <div
                className="h-2 bg-primary rounded"
                style={{
                  width: `${item.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
