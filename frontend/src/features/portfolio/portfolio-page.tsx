import { AboutSection } from "./sections/about-section";
import { ContactSection } from "./sections/contact-section";
import { EducationSection } from "./sections/education-section";
import { ExperienceSection } from "./sections/experience-section";
import { HomeSection } from "./sections/home-section";
import { ProjectsSection } from "./sections/projects-section";
import { SkillsSection } from "./sections/skills-section";

export function PortfolioPage() {
  return (
    <div className="flex w-full flex-col">
      <HomeSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </div>
  );
}