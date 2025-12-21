import React from "react";

const StatusCard = ({ status, color, number }) => {
  return (
    <div
      className={`p-4 space-y-1 rounded-lg`}
      style={{ backgroundColor: color }}
    >
      <h1 className=" text-xl font-semibold">{status}</h1>
      <p className="text-muted-foreground">
        {number <= 1 ? `${number} task` : `${number} tasks`}
      </p>
    </div>
  );
};

export default StatusCard;
