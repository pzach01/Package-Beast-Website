import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Shipment } from 'src/app/_models/shipment';

@Component({
  selector: 'app-shipment-detail',
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.scss']
})
export class ShipmentDetailComponent {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @Input() shipment: Shipment;

  renderer = new THREE.WebGLRenderer();
  scene = null;
  camera = null;
  mesh = null;
  controls = null;


  constructor() {

  }

  ngAfterViewInit() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);


    this.generateItemCubes()
    this.generateContainerCubes()

    this.renderer.setSize(window.innerWidth, 9 * window.innerHeight / 10);
    this.renderer.setClearColor(0xffffff, 1);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.animate();
  }

  animate() {
    window.requestAnimationFrame(() => this.animate());
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }

  generateItemCubes() {
    this.shipment.items.forEach(item => {
      console.log("shippy", item)
      const geometry = new THREE.BoxGeometry(item.width, item.height, item.length);

      var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
      // const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
      var material = new THREE.MeshPhongMaterial({ color: randomColor, specular: 0x555555, shininess: 120, wireframe: false, side: THREE.DoubleSide, transparent: true, opacity: .9 });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.x = item.xCenter
      this.mesh.position.y = item.yCenter
      this.mesh.position.z = item.zCenter
      this.scene.add(this.mesh);


    });
  }

  generateContainerCubes() {
    const container = this.shipment.containers.filter(container => container.id == this.shipment.items[0].container)[0]

    const geometry = new THREE.BoxGeometry(container.width, container.height, container.length);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = container.width / 2
    this.mesh.position.y = container.height / 2
    this.mesh.position.z = container.length / 2
    this.scene.add(this.mesh);


    var light = new THREE.DirectionalLight(0xffffff, .1);
    light.position.set(container.width, container.height, container.length).normalize();
    this.scene.add(light);

    var light3 = new THREE.DirectionalLight(0xffffff, .1);
    light.position.set(0, 0, 0).normalize();
    this.scene.add(light3);

    var light2 = new THREE.AmbientLight(0x404040, 3); // soft white light
    this.scene.add(light2);

    this.setCameraAndControls(container.width, container.height, container.length);
  }
  setCameraAndControls(containerWidth, containerHeight, containerLength) {
    const cameraZPosition = Math.max(containerWidth, containerHeight, containerLength)
    this.camera.position.z = 1.5 * cameraZPosition;
    this.camera.position.x = containerWidth;
    this.camera.position.y = containerHeight;
    this.controls.target = new THREE.Vector3(containerWidth / 2, containerHeight / 2, containerLength / 2);
    this.controls.update();
  }
}

