import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of }         from 'rxjs/observable/of';
import * as _         from 'lodash';

export interface IModel {
  id: any;
}

export class MemoryRepoService<ModelType extends IModel> {
  protected models: ModelType[];
  protected nextId: number;

  constructor() {
    this.models = [];
    this.nextId = 0;
  }

  getOne(id: any): Observable<ModelType> {
    let res = _.chain(this.models)
      .find({ id: parseInt(id) })
      .cloneDeep()
      .value() as ModelType;
    return of(res);
  }

  getList(): Observable<ModelType[]> {
    let res = _.cloneDeep(this.models);
    return of(res);
  }

  create(model: ModelType): Observable<ModelType> {
    let createdModel = _.cloneDeep(model);
    createdModel.id = ++this.nextId;
    this.models.push(createdModel);

    let res = _.cloneDeep(createdModel);
    return of(res);
  }

  update(modelData: ModelType): Observable<ModelType> {
    let updatedModel = _.find(this.models, { id: parseInt(modelData.id) });
    _.extend(updatedModel, modelData);
    return of(_.cloneDeep(updatedModel) as ModelType);
  }

  delete(id: any): Observable<boolean> {
    let result = _.remove(this.models, model => model.id === parseInt(id));
    return of(!!result);
  }
}

@Injectable()
export class MemoryRepoServiceFactory {
  getInstance() {
    let instance = new MemoryRepoService();
    return instance;
  }
}
