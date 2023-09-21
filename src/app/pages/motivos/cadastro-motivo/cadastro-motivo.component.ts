import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Motivos } from 'src/app/core/models/motivos.model';
import { Regex } from 'src/app/core/validators/regex.model';
import { MotivosService } from '../motivos.service';
import { ErrorHandlerService } from 'src/app/core/errorhandler.service';
import { AuthService } from '../../seguranca/auth.service';

@Component({
  selector: 'app-cadastro-motivo',
  templateUrl: './cadastro-motivo.component.html',
  styleUrls: ['./cadastro-motivo.component.css']
})
export class CadastroMotivoComponent {

  @ViewChild('formMotivo') formMotivo: NgForm;

  regex = new Regex();
  newmotivo = new Motivos();
  idmotivo: string;
  salvando: boolean;

  constructor(
    private motivoService: MotivosService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private confirmation: ConfirmationService,
    private spinner: NgxSpinnerService,
    // private errorHandler: ErrorHandlerService,
    // public auth: AuthService,
  ) { }

  ngOnInit() {
    this.idmotivo = this.route.snapshot.params['id'];
    this.title.setTitle('Cadastro de Motivo');
    if (this.idmotivo) {
      this.spinner.show();
      this.carregarMotivo(this.idmotivo);
    } else {
      this.newmotivo.status = true;
    }
  }

  get editando() {
    return Boolean(this.newmotivo.id);
  }

  salvar(form: NgForm) {
    if (form.invalid) {
      return; //Não prosseguir se o formulário não for válido
    }
  
    if (this.editando) {
      this.atualizarMotivo(form);
    } else {
      this.adicionarMotivo(form);
    }
  }

  adicionarMotivo(form: NgForm) {
    this.salvando = true;
    this.motivoService
      .adicionarMotivo(this.newmotivo)
      .then((obj) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Motivo',
          detail: `${obj.descricao}, adicionado com sucesso!`,
        });
        this.salvando = false;
        this.router.navigate(['/motivos']);
      })
      .catch((erro) => {
        this.salvando = false;
      //  this.errorHandler.handle(erro);
      });
  }
  atualizarMotivo(form: NgForm) {
    this.salvando = true;
    this.motivoService
      .atualizarMotivos(this.newmotivo)
      .then((obj) => {
        this.newmotivo = obj;
        this.messageService.add({
          severity: 'info',
          summary: 'Motivo',
          detail: `${obj.descricao}, alterado com sucesso!`,
        });
        this.atualizarTituloEdicao();
        this.salvando = false;
        this.router.navigate(['/motivos']);
      })
      .catch((erro) => {
        this.salvando = false;
      //  this.errorHandler.handle(erro);
      });
  }
  carregarMotivo(id: string) {
    this.motivoService
      .buscarPorID(id)
      .then((obj) => {
        this.newmotivo = obj;
        this.atualizarTituloEdicao();
        this.spinner.hide();
      })
      .catch((erro) => {
        this.spinner.hide();
      //  this.errorHandler.handle(erro);
      });
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de Motivo: ${this.newmotivo.descricao}`);
  }

  confirmarExclusao() {
    this.confirmation.confirm({
      message: `Tem certeza que deseja excluir: <b>${this.newmotivo.descricao}</b> ?`,
      accept: () => {
        this.excluir(this.idmotivo);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              summary: 'Ação cancelada',
              detail: 'Você cancelou',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'error',
              summary: 'Ação rejeitada',
              detail: 'Você rejeitou',
            });
            break;
        }
      },
    });
  }

  excluir(id: any) {
    this.motivoService
      .excluir(id)
      .then(() => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Motivo',
          detail: `${this.newmotivo.descricao}, excluído com sucesso!`,
        });
        this.router.navigate(['/motivos']);
      })
      .catch((erro) => {
      //  this.errorHandler.handle(erro);
      });
  }
}