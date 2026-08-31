import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConstructionService } from '../../services/construction.service';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  constructionService = inject(ConstructionService);

  readonly contactForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    company: new FormControl('', { nonNullable: true }),
    projectInterest: new FormControl('Commercial High-Rise', { nonNullable: true }),
    subject: new FormControl('New Project Consultation', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  readonly isSubmitting = signal<boolean>(false);
  readonly submittedSuccessMessage = signal<string>('');

  handleSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.contactForm.getRawValue();

    this.constructionService.submitContactMessage(formVal).subscribe((res) => {
      this.isSubmitting.set(false);
      this.submittedSuccessMessage.set(res.message);
      this.contactForm.reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectInterest: 'Commercial High-Rise',
        subject: 'New Project Consultation',
        message: ''
      });
    });
  }
}
