import { Card, CardContent } from "@/components/ui/card";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { Fragment, useState } from "react";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import ExameDetailsForm from "../components/ExameDetailsForm";
import ParentDetailsForm from "../components/ParentDetailsForm";
import { registerStudent } from "@/firebase/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { EXAM_YEARS } from "@/constants";
import { CircularProgress } from "@mui/material";

const steps = ["Personal Details", "Exame Details", "Parent Details"];

const RegisterAsNewPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
    const [loading, setLoading] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nic, setNic] = useState("");
  const [bDate, setBDate] = useState<Date>(new Date());
  const [phone, setPhone] = useState("");

  const [school, setSchool] = useState("");
  const [examYear, setExamYear] = useState(EXAM_YEARS[0].year);
  const [media, setMedia] = useState("sinhala");
  const [stream, setStream] = useState("maths");

  const [gurdianName, setGurdiandName] = useState("");
  const [gurdianPhone, setGurdianPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  // const isStepOptional = (step: number) => {
  //   return step === 1;
  // };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleSkip = () => {
  //   if (!isStepOptional(activeStep)) {
  //     throw new Error("You can't skip a step that isn't optional.");
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  const handleSubmit = async () => {
    if (currentUser) {
      setLoading(true);
      console.log(gurdianName, gurdianPhone, address);

      if (
        !gurdianName ||
        !gurdianPhone ||
        !address ||
        !firstName ||
        !lastName ||
        !whatsapp ||
        !nic ||
        !bDate ||
        !phone ||
        !school ||
        !examYear ||
        !media ||
        !stream
      ) {
        toast({
          title: "Please fill all the fields",
          variant: "destructive",
        });
        return;
      }

      await registerStudent(
        {
          firstName,
          lastName,
          whatsapp,
          nic,
          bDate,
          phone,
          school,
          examYear,
          media,
          stream,
          gurdianName,
          gurdianPhone,
          address,
        },
        currentUser?.uid
      );

      navigate("/dashboard");
      setActiveStep(0);
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-[80%] h-[80%] flex p-3 justify-center bg-[#ffffff]">
        <CardContent className="w-full">
          <div className="w-full h-full relative">
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                // if (isStepOptional(index)) {
                //   labelProps.optional = (
                //     <Typography variant="caption">Optional</Typography>
                //   );
                // }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            <div>
              <div>
                {activeStep == 0 && (
                  <PersonalDetailsForm
                    bDate={bDate}
                    firstName={firstName}
                    lastName={lastName}
                    nic={nic}
                    whatsapp={whatsapp}
                    phone={phone}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setWhatsapp={setWhatsapp}
                    setNic={setNic}
                    setBDate={setBDate}
                    setPhone={setPhone}
                  />
                )}
              </div>
              <div>
                {activeStep == 1 && (
                  <ExameDetailsForm
                    school={school}
                    exameYear={examYear}
                    media={media}
                    stream={stream}
                    setSchool={setSchool}
                    setExamYear={setExamYear}
                    setMedia={setMedia}
                    setStream={setStream}
                  />
                )}
              </div>
              <div>
                {activeStep == 2 && (
                  <ParentDetailsForm
                    address={address}
                    setAddress={setAddress}
                    gurdianName={gurdianName}
                    setGurdiandName={setGurdiandName}
                    gurdianPhone={gurdianPhone}
                    setGurdianPhone={setGurdianPhone}
                  />
                )}
              </div>
            </div>

            <div className="absolute bottom-10 w-full flex justify-center items-center">
              <div className="w-[50%]">
                <Fragment>
                  {/* <Typography sx={{ mt: 2, mb: 1 }}>
                  Step {activeStep + 1}
                </Typography> */}
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {/* {isStepOptional(activeStep) && (
                        <Button
                          color="inherit"
                          onClick={handleSkip}
                          sx={{ mr: 1 }}
                        >
                          Skip
                        </Button>
                      )} */}
                    {activeStep < steps.length - 1 ? (
                      <Button onClick={handleNext}>Next</Button>
                    ) : (
                       <Button onClick={handleSubmit} disabled={loading}>{loading ? <CircularProgress />: "Submit"}</Button>
                    )}
                  </Box>
                </Fragment>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};
export default RegisterAsNewPage;
