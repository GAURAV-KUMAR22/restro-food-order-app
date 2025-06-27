import React from "react";

export const Package = () => {
  return (
    <div className=" h-full mt-10 px-10">
      <h1 className="text-2xl font-bold text-center">Pick Best the Plan</h1>
      <p className="text-center text-sm">
        Take your desired planto get accesss to our content
      </p>
      <div className="flex flex-row justify-center overflow-x-scroll my-10 gap-12">
        <div className="w-[300px] h-[600px] border p-2">
          <h1 className="text-center text-3xl font-bold  border-[50%] border-b-2">
            Basic
          </h1>
        </div>
        <div className="w-[300px] h-[600px] border">
          <h1>Standard</h1>
        </div>
        <div className="w-[300px] h-[600px] border">
          <h1>Primium</h1>
        </div>
      </div>
    </div>
  );
};
