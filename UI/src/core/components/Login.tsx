// in src/Login.js
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';

import { alpha, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';


import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Paper from '@mui/material/Paper';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

import LinearProgress, { linearProgressClasses, LinearProgressProps } from '@mui/material/LinearProgress';


import loginbg from '../../assets/loginbg.jpg';
import siriusscan from '../../assets/sirius-scan.png';

import config from '../../../config.json';

const Login = ({ theme }) => {
    const [initialStartup, setInitialStartup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [progress, setProgress] = useState(0);
    const [serverProgress, setServerProgress] = useState(0);
    const [phase, setPhase] = useState('');
    const login = useLogin();
    const notify = useNotify();


    //Check if first time startup
    useEffect(() => {
        setInitialStartup(true);
        var checktime = 5000;
        //Make API get request to get current system status
        setInterval(() => {
            fetch('http://' + config.server.host + ':' + config.server.port + '/api/status')
            .then((response) => response.json())
            .then((data) => {
                if (data.status == "Initializing" || data.status == "init") {
                    console.log(data.tasks[0].task_name);
                    setServerProgress(data.tasks[0].task_progress);
                    setPhase(data.tasks[0].task_name)
                } else if (data.status == "init") {
                    console.log(data.status);
                } else {
                    setInitialStartup(false);
                    checktime = 60000;
                }
                console.log(data);
            });
        }, checktime);
        
    }, [])


    useEffect(() => {
        const timer = setInterval(() => {
            console.log("Progress: " + progress + " Server Progress: " + serverProgress)
            if (progress < serverProgress) {
                setProgress((prevProgress) => prevProgress + 1);
            }
        }, 1000);
        return () => {
            clearInterval(timer);
          };
      }, [progress, serverProgress]);


    const handleSubmit = e => {
        e.preventDefault();
        if (email === 'admin' && password === 'sirius') {
            login({ email, password }).catch(() =>
                notify('Invalid email or password')
            );
        } else {
            notify('Invalid email or password')
        }
    };

    return (
      <Container sx={{backgroundImage: `url(${loginbg})`, backgroundPosition: "center", backgroundSize: "cover", minWidth: "100vw", minHeight: "100vh", alignItems: "center", justifyContent: "center", display: "flex", position: "absolute"}}  component="main">
        {/* Show Loading Bar & Modal if first time startup */}
        
        { initialStartup ? <FirstTimeStartup value={progress} phase={phase} startup={initialStartup} /> :
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    position: "relative",
                    boxShadow: 3,
                    borderRadius: 2,
                    marginTop: -35,
                    px: 4,
                    py: 6,
                    flexDirection: "column",
                    alignItems: "center",
                    background: "transparent",
                    border: "2px solid #f7c1ac",
                    borderRadius: "15px",
                    backdropFilter: "blur(10px)",
                    justifyContent: "center",
                    width: "450px",
                    height: "500px",
                    color: "white",
                }}
            > 
                <img src={siriusscan} alt="sirius-scan" style={{height: "90px"}} />
                <Typography sx={{
                    fontFamily: "arial",
                    fontSize: "30px",
                    textTransform: "uppercase",
                    fontStyle: "bold",
                    alignItems: "center"
                }}>
                    
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} autoComplete="off">
                    <LoginTextField 
                        sx={{mt: 5}}
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='email'
                        label='Username'
                        placeholder="Username"
                        name='email'
                        autoComplete='email'
                        autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <LoginTextField 
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        label="Password"
                        placeholder="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ 
                            mt: 3, 
                            mb: 5,
                            height: "50px",
                            width: "100%",
                            background: "linear-gradient(45deg, #e9809a 30%, #f7ae99 90%)",
                            borderRadius: "15px",
                            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                            color: "black",
                            fontFamily: "arial",
                            fontSize: "20px",
                            fontWeight: "bold",
                            textTransform: "none",
                            "&:hover": {
                                background: "linear-gradient(45deg, #e9809a  30%, #9e8f9b 90%)",
                                boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                                color: "white"
                            },
                        }}
                    >
                    Join the Pack
                    </Button>
                            {/* Forgot Password and Sign Up
                            <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                            </Grid>
                            */}
                </Box>
            </Box>
        </Container>
        }
      </Container>

    );
};

export default Login;

// First Time Component
const FirstTimeStartup = (props: LinearProgressProps & { value: number } & {phase: string}) => {

    return (
        <>
            { props.value < 200 ? 
                <>
                    <Box sx={{
                            position: "absolute",
                            display: "flex",
                            width: "850px",
                            mt: 0,
                        }}
                    >
                        <Typography sx={{
                            fontFamily: "arial",
                            fontSize: "30px",
                            textTransform: "uppercase",
                            fontStyle: "bold",
                            alignItems: "center",
                            color: "white",
                            position: "absolute",
                            left: 20,
                            top: -60,
                            color: '#f7c1ac',
                        }}>
                            {props.phase}
                        </Typography>
                        <br />
                        <LoadingBar value={props.value} />
                    </Box>

                </> :
                <>
                    <Box sx={{
                            position: "absolute",
                            display: "flex",
                            width: "850px",
                            mt: 100,
                        }}
                    >
                            <LoadingBar value={props.value} />
                        </Box>
                    <Box sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",

                        }}
                    >
                        <FirstTimeCarousel />
                    </Box>
                
                </>
            }
        </>
    )
}

// Centered Loading Bar Component
const LoadingBar = (props: LinearProgressProps & { value: number }) => {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LoadingLinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="h3" sx={{color: '#e88d7c'}}>{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    )
}

const LoadingLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 55,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: '#f7c1ac',
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#e88d7c' : '#f7c1ac',
    },
  }));

const carouselContent = [
    {
        label: 'First slide label',
        imgPath: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    },
    {
        label: 'Second slide label',
        imgPath: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    },
];


// FirstTimeCarousel
const FirstTimeCarousel = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = carouselContent.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const theme = {
        direction: 'ltr',
    }

    return (
        <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
            <MobileStepper
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                        Next
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Back
                    </Button>
                }
            />
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 150,
                    pl: 5,
                    bgcolor: 'background.default',
                }}
            >
                <Typography>{carouselContent[activeStep].label}</Typography>
            </Paper>
            <AutoPlaySwipeableViews

                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {carouselContent.map((step, index) => (
                    <Box

                        key={step.label}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            height: 255,
                            pl: 1,
                            pr: 1,
                            bgcolor: 'background.default',
                        }}
                    >
                        {Math.abs(activeStep - index) <= 2 ? (
                            <>
                            <img src={step.imgPath} alt={step.label} />
                            test
                            </>

                        ) : null}
                    </Box>
                ))}
            </AutoPlaySwipeableViews>
        </Box>
    );
};



const LoginTextField = styled(TextField)({
    '& .MuiInputLabel-root': {
        color: '#9a8686',
        fontSize: '16px',
    },
    '& label.Mui-focused': {
      color: '#f7c1ac',
      fontSize: '16px',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#3962b2',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#f7c1ac',
      },
      '&:hover fieldset': {
        borderColor: '#e88d7c',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3962b2',
      },
    },
    '& .MuiInputBase-input': {
        color: 'white',
        fontSize: '20px',
      },
  });