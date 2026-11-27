import { ProjectsModule } from "./modules/projects/projects.module.js";
import { ContactModule } from "./modules/contact/conatct.module.js";
import { ExperienceModule } from "./modules/experance/exp.module.js";
import { SkillsModule } from "./modules/skills/skills.module.js";
import { EducationModule } from "./modules/education/education.module.js";
import { ProfileModule } from "./modules/profile/profile.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { UploadsModule } from "./modules/uploads/uploads.module.js";

export const modules = [
  AuthModule,
  UploadsModule,
  ProjectsModule,
  ContactModule,
  ExperienceModule,
  SkillsModule,
  EducationModule,
  ProfileModule,
];