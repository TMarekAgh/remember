import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-module-hub',
  templateUrl: './module-hub.component.html',
  styleUrls: ['./module-hub.component.sass']
})
export class ModuleHubComponent implements OnInit {

  constructor() { }

  modules: Module[] = [{
    name: 'Grapher',
    description: 'Store data in a graph like structure'
  }]

  ngOnInit(): void {}

}

export type Module = {
  name: string;
  description: string;
}
