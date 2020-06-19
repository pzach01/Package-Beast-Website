import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output } from '@angular/core';
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
  clickedItem: Item;
  shipment: Shipment;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  scene = new THREE.Scene();;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / (.7 * window.innerHeight), 1, 10000);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  shipmentId: number;
  threeJSitems = [];
  itemColors: string[] = ["#FFFF00", "#FB9404", "#ED0F71", "#742E8F", "#5987C5", "#02C3F3", "#00A55D", "#1B4279"];

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
  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, .7 * window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.generateItemCubes();
    this.generateLights();
    this.generateContainerCube();
    this.setCameraAndControls();
    this.animate();
    this.rendererContainer.nativeElement
      .addEventListener('mousedown', this.onMouseOrTouch.bind(this));
    this.rendererContainer.nativeElement
      .addEventListener('touchstart', this.onMouseOrTouch.bind(this));

  }

  animate() {
    // update the picking ray with the camera and mouse position


    window.requestAnimationFrame(() => this.animate());
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }

  generateItemCubes() {
    var axesHelper = new THREE.AxesHelper(30);
    this.scene.add(axesHelper)
    this.items.forEach((item, index) => {
      console.log("shippy", item)
      const geometry = new THREE.BoxGeometry(item.yDim, item.xDim, item.zDim);

      var randomColor = this.itemColors[index % this.itemColors.length]
      let material = new THREE.MeshPhongMaterial({ color: randomColor, specular: 0x555555, shininess: 120, wireframe: false, side: THREE.DoubleSide, transparent: true, opacity: .9 });
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = item.yCenter
      mesh.position.y = item.xCenter
      mesh.position.z = item.zCenter

      const edges = new THREE.BoxHelper(mesh, 'white');

      mesh.name = item.id.toString();
      this.scene.add(mesh);
      this.threeJSitems.push(mesh)
      this.scene.add(edges)
    });
  }

  generateContainerCube() {

    const geometry = new THREE.BoxGeometry(this.container.yDim, this.container.xDim, this.container.zDim);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    let mesh = new THREE.Mesh(geometry, material);
    console.log("generateContainer: this.container =", this.container)
    mesh.name = this.container.description;
    mesh.position.x = this.container.yDim / 2
    mesh.position.y = this.container.xDim / 2
    mesh.position.z = this.container.zDim / 2
    this.scene.add(mesh);
  }

  generateLights() {
    var light = new THREE.DirectionalLight(0xffffff, .1);
    light.position.set(this.container.yDim, this.container.xDim, this.container.zDim).normalize();
    this.scene.add(light);

    var light3 = new THREE.DirectionalLight(0xffffff, .1);
    light.position.set(0, 0, 0).normalize();
    this.scene.add(light3);

    var light2 = new THREE.AmbientLight(0x404040, 3); // soft white light
    this.scene.add(light2);
  }

  setCameraAndControls() {
    const cameraZPosition = Math.max(this.container.yDim, this.container.xDim, this.container.zDim)
    this.camera.position.z = 1.5 * cameraZPosition;
    this.camera.position.x = this.container.yDim;
    this.camera.position.y = this.container.xDim;
    this.controls.target = new THREE.Vector3(this.container.yDim / 2, this.container.xDim / 2, this.container.zDim / 2);
    this.controls.update();
  }

  onMouseOrTouch(event) {
    console.log(event.type);

    if (event.type == "touchstart") {
      var rect = event.target.getBoundingClientRect();
      var x = event.targetTouches[0].pageX - rect.left;
      var y = event.targetTouches[0].pageY - rect.top;
      this.mouse.x = (x / window.innerWidth) * 2 - 1;
      this.mouse.y = - (y / (.7 * window.innerHeight)) * 2 + 1;
    } else if (event.type == "mousedown") {
      this.mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
      this.mouse.y = - (event.offsetY / (.7 * window.innerHeight)) * 2 + 1;
    }

    console.log(this.mouse)
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    let intersects = this.raycaster.intersectObjects(this.threeJSitems);
    let clickedObject = intersects[0];


    this.threeJSitems.forEach((threeJSitem, index) => {
      threeJSitem.material.color.set(this.itemColors[index % this.itemColors.length])
      this.clickedItem = null;
    });

    if (intersects.length != 0) {
      //@ts-ignore
      clickedObject.object.material.color.set("#ff0000");
      this.clickedItem = this.items.filter(item => item.id == +clickedObject.object.name)[0]
      console.log("clicked item:", this.clickedItem)
    }
  }

}