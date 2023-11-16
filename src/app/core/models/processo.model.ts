import { Clientes } from './cliente.model';
import { Motivos } from './motivos.model';
import { Status } from './status.model';
import { Varas } from './varas.model';

export class Processos {
  _id?: string;
  numeroprocesso?: number;
  cliente = new Clientes();
  vara =  new Varas();
  status = new Status();
  motivo = new Motivos();
  datacriacao?: Date;
 // usuariocriacao= new Usuarios();
  itensprocesso = new Array<ItensProcesso>();

}

export class ItensProcesso {
  codigo?: number;
  informacoes?: string;
  usuariocriacao?: string;
  datacriacao?: Date;
}
