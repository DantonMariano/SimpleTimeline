import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import { Card, Typography, Grid, TextField } from "@mui/material";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [items, setItems] = useState(timelineItems);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");


  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => t * (2 - t),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // GSAP ScrollTrigger for animation based on scroll position
  useEffect(() => {
    const timelineElements = document.querySelectorAll(".timeline-item");

    gsap.utils.toArray(timelineElements).forEach((element: HTMLElement, index) => {
      gsap.fromTo(
        element,
        {
          rotationX: 90,
          opacity: 0,
          y: -50,
        },
        {
          rotationX: 0,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.75)",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        }
      );
    });
  }, []);
  useEffect(() => {
    gsap.to(".title", {
      y: 200,
      scrollTrigger: {
        trigger: ".title",
        start: "top 50%",
        end: "bottom top",
        scrub: true,
        markers: false,
      },
    });
  }, []);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(items[index].name);
  };

  const handleSave = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].name = editingText;
    setItems(updatedItems);
    setEditingIndex(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(event.target.value);
  };

  return (
    <div className="timeline-container">
      <Typography
        variant="h1"
        color="initial"
        fontFamily={'Archivo'}
        sx={{ marginTop: "35vh", marginBottom: "200px", display: "flex", justifyContent: "center" }}
        className="title"
      >
        Simple Timeline
      </Typography>
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
      >
        <Timeline position="alternate" sx={{ maxWidth: "850px", padding: "0 20px" }}>
          {items.map((item, index) => (
            <TimelineItem
              key={index}
              className="timeline-item"
            >
              <TimelineSeparator>
                <TimelineDot />
                {index < items.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography
                  gutterBottom
                  sx={{ color: "text.secondary", fontSize: 14 }}
                >
                  {item.start}
                </Typography>
                <Card
                  sx={{ padding: 5 }}
                  variant="outlined"
                  onClick={() => handleEdit(index)}
                >
                  {editingIndex === index ? (
                    <TextField
                      value={editingText}
                      onChange={handleChange}
                      onBlur={() => handleSave(index)}
                      fullWidth
                      autoFocus
                      variant="standard"
                      sx={{ input: { padding: '0' } }}
                    />
                  ) : (
                    item.name
                  )}
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Grid>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
