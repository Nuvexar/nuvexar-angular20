import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { Hero } from "../../components/hero/hero";
import { SectionDivider } from "../../../shared/components/section-divider/section-divider";
import { ServicesSection } from "../../components/services-section/services-section";
import { Clients } from "../../components/clients/clients";
import { About } from "../../components/about/about";
import { Contact } from "../../components/contact/contact";
import { Footer } from "../../components/footer/footer";
import { WhatsappBtn } from "../../../shared/components/whatsapp-btn/whatsapp-btn";

@Component({
  selector: 'app-landing-page',
  imports: [Header, Hero, SectionDivider, ServicesSection, Clients, About, Contact, Footer, WhatsappBtn],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage { }
