import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Shipment } from 'src/app/_models/shipment';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';

@Component({
  selector: 'app-rendering',
  templateUrl: './rendering.component.html',
  styleUrls: ['./rendering.component.scss']
})
export class RenderingComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @Input() items: Item[];
  @Input() container: Container;
  shipment: Shipment;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  scene = new THREE.Scene();;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  shipmentId: number;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    console.log("items from renderingComponent", this.items)

    //this.items = this.items.filter(item => item.container == this.container.id)
    console.log("container from renderingComponent", this.container)
    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // (+) converts string 'id' to a number
      console.log("shipmentId", this.shipmentId)
    })
    // this.container = new Container()
    // this.container.id = 1000
    // this.container.description = "hello"
    // this.container.height = 8
    // this.container.length = 7
    // this.container.width = 7

  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.generateItemCubes();
    this.generateLights();
    this.generateContainerCube();
    this.setCameraAndControls();
    this.animate();
    this.rendererContainer.nativeElement
      .addEventListener('click', this.onClick.bind(this));

  }

  animate() {
    // update the picking ray with the camera and mouse position


    window.requestAnimationFrame(() => this.animate());
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }

  generateItemCubes() {
    this.items.forEach(item => {
      console.log("shippy", item)
      const geometry = new THREE.BoxGeometry(item.width, item.height, item.length);

      var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
      // const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
      let material = new THREE.MeshPhongMaterial({ color: randomColor, specular: 0x555555, shininess: 120, wireframe: false, side: THREE.DoubleSide, transparent: true, opacity: .9 });
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = item.xCenter
      mesh.position.y = item.yCenter
      mesh.position.z = item.zCenter

      const edges = new THREE.BoxHelper(mesh, 'white');
      // const group = new THREE.Group();
      // group.add(mesh);
      // group.add(edges);

      mesh.name = item.description;
      this.scene.add(mesh);
      this.scene.add(edges)
    });
  }

  generateContainerCube() {

    const geometry = new THREE.BoxGeometry(this.container.width, this.container.height, this.container.length);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    let mesh = new THREE.Mesh(geometry, material);
    console.log("generateContainer: this.container =", this.container)
    mesh.name = this.container.description;
    mesh.position.x = this.container.width / 2
    mesh.position.y = this.container.height / 2
    mesh.position.z = this.container.length / 2
    this.scene.add(mesh);
  }

  generateLights() {
    var light = new THREE.DirectionalLight(0xffffff, .1);
    light.position.set(this.container.width, this.container.height, this.container.length).normalize();
    this.scene.add(light);

    var light3 = new THREE.DirectionalLight(0xffffff, .1);
    light.position.set(0, 0, 0).normalize();
    this.scene.add(light3);

    var light2 = new THREE.AmbientLight(0x404040, 3); // soft white light
    this.scene.add(light2);
  }

  setCameraAndControls() {
    const cameraZPosition = Math.max(this.container.width, this.container.height, this.container.length)
    this.camera.position.z = 1.5 * cameraZPosition;
    this.camera.position.x = this.container.width;
    this.camera.position.y = this.container.height;
    this.controls.target = new THREE.Vector3(this.container.width / 2, this.container.height / 2, this.container.length / 2);
    this.controls.update();
  }

  onClick(event) {
    console.log(event);
    this.mouse.x = (event.layerX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.layerY / window.innerHeight) * 2 + 1;
    console.log(this.mouse)
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(this.scene.children);

    for (var i = 0; i < intersects.length; i++) {
      console.log(intersects[i].object)
      // intersects[ i ].object.material.color.set( 0xff0000 );

    }
  }
}