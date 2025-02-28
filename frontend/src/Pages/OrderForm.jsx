import React, { useState } from "react";
import { Button, Stepper, Step, StepLabel } from "@mui/material";
import { CloudUpload, DesignServices, CheckCircle } from "@mui/icons-material";

const steps = [
  { label: "Upload Image", icon: <CloudUpload /> },
  { label: "Customize Design", icon: <DesignServices /> },
  { label: "Review & Confirm", icon: <CheckCircle /> },
];

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState(null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleImageUpload = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-5">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel icon={step.icon}>
              <div
                className={`border-b-4 pb-2 ${
                  activeStep === index
                    ? "border-black"
                    : index < activeStep
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {step.label}
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-5 border rounded-lg p-5 text-center bg-gray-100">
        {activeStep === 0 && (
          <div className="flex flex-col items-center">
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/png, image/jpeg"
            />
            {image && (
              <img
                src={image}
                alt="Uploaded"
                className="mt-4 w-64 h-64 object-cover"
              />
            )}
          </div>
        )}
        {activeStep === 1 && <p>Customize your design here...</p>}
        {activeStep === 2 && <p>Review your design before confirming...</p>}
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="contained"
        >
          Back
        </Button>
        <Button onClick={handleNext} variant="contained" color="primary">
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;
