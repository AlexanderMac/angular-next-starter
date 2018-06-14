import { Injectable }        from '@angular/core';
import { Observable }        from 'rxjs/Observable';
import * as _                from 'lodash';
import { IModel,
         MemoryRepoService } from './memory-repo.service';

export class LocalStorageRepoService<ModelType extends IModel> extends MemoryRepoService<ModelType> {
  private localStorage: Storage;
  private collectionName: string;

  constructor(window: Window) {
    super();
    this.localStorage = window.localStorage;
  }

  init(collectionName: string) {
    this.collectionName = collectionName;
    this.load();
  }

  load(): void {
    let modelsStr = this.localStorage.getItem(this.collectionName);
    if (modelsStr) {
      let parsedModels = _.attempt(JSON.parse.bind(null, modelsStr)) as any[];
      let models = _.isError(parsedModels) ? [] : parsedModels as ModelType[];
      this.models = _.map(models, model => new ModelType(model));
      let nextIdStr = _.chain(this.models)
        .map('id')
        .max()
        .value();
      this.nextId = +nextIdStr || 0;
    }
  }

  save(): void {
    let modelsStr = JSON.stringify(this.models);
    this.localStorage.setItem(this.collectionName, modelsStr);
  }

  create(model: any): Observable<any> {
    let obs = super.create(model);
    obs.subscribe(() => this.save());
    return obs;
  }

  update(modelData: any): Observable<any> {
    let obs = super.update(modelData);
    obs.subscribe(() => this.save());
    return obs;
  }

  delete(id: any): Observable<boolean> {
    let obs = super.delete(id);
    obs.subscribe(() => this.save());
    return obs;
  }
}

@Injectable()
export class LocalStorageRepoServiceFactory {
  getInstance<ModelType>(window: Window) {
    let instance = new LocalStorageRepoService<ModelType>(window);
    return instance;
  }
}
