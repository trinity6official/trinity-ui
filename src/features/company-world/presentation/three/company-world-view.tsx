'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { createCompanyWorldScene, type CompanySceneTarget } from './company-world-scene';

type AccessPhase = 'overview' | 'card-selected' | 'entering' | 'inside';

const targetLabels: Readonly<Record<CompanySceneTarget, string>> = {
  'access-card': 'Access card',
  entrance: 'Secure entrance',
  network: 'Network',
  people: 'People',
  'server-room': 'Server Room',
  security: 'Security',
};

export function CompanyWorldView() {
  const mountRef = useRef<HTMLDivElement>(null);

  const phaseRef = useRef<AccessPhase>('overview');
  const focusedRef = useRef<CompanySceneTarget | null>(null);

  const [phase, setPhase] = useState<AccessPhase>('overview');
  const [focusedTarget, setFocusedTarget] = useState<CompanySceneTarget | null>(null);

  function updatePhase(nextPhase: AccessPhase) {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  function updateFocusedTarget(target: CompanySceneTarget | null) {
    focusedRef.current = target;
    setFocusedTarget(target);
  }

  function presentCard() {
    if (phaseRef.current === 'inside') {
      updatePhase('overview');
      updateFocusedTarget(null);
      return;
    }

    if (phaseRef.current === 'overview') {
      updatePhase('card-selected');
      return;
    }

    updatePhase('entering');
    updateFocusedTarget('entrance');
  }

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      mount.dataset.webglUnavailable = 'true';
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.appendChild(renderer.domElement);

    const world = createCompanyWorldScene(width, height);
    const selectableObjects = [...world.selectableObjects];

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    let animationFrame = 0;
    let progress = 0;
    const currentPosition = world.overviewPosition.clone();
    const currentTarget = world.overviewTarget.clone();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resolveTarget(object: THREE.Object3D) {
      let current: THREE.Object3D | null = object;

      while (current) {
        const target = current.userData.target as CompanySceneTarget | undefined;

        if (target) {
          return target;
        }

        current = current.parent;
      }

      return null;
    }

    function pickTarget(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, world.camera);

      const hit = raycaster.intersectObjects(selectableObjects, true)[0];

      return hit ? resolveTarget(hit.object) : null;
    }

    function handlePointerMove(event: PointerEvent) {
      const target = pickTarget(event);

      renderer.domElement.style.cursor = target ? 'pointer' : 'default';

      if (target && target !== 'access-card' && target !== 'entrance') {
        updateFocusedTarget(target);
      }
    }

    function handlePointerLeave() {
      renderer.domElement.style.cursor = 'default';
    }

    function handlePointerUp(event: PointerEvent) {
      const target = pickTarget(event);

      if (!target) {
        return;
      }

      if (target === 'access-card') {
        if (phaseRef.current === 'overview') {
          updatePhase('card-selected');
        }
        return;
      }

      if (target === 'entrance') {
        if (phaseRef.current === 'overview') {
          updatePhase('card-selected');
          updateFocusedTarget('entrance');
          return;
        }

        if (phaseRef.current === 'card-selected') {
          updatePhase('entering');
          updateFocusedTarget('entrance');
        }

        return;
      }

      updateFocusedTarget(target);
    }

    function handleResize() {
      const currentMount = mountRef.current;

      if (!currentMount) {
        return;
      }

      const nextWidth = currentMount.clientWidth;
      const nextHeight = currentMount.clientHeight;

      world.camera.aspect = nextWidth / Math.max(nextHeight, 1);
      world.camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    }

    function render(time: number) {
      const entering = phaseRef.current === 'entering' || phaseRef.current === 'inside';

      const desiredProgress = entering ? 1 : 0;

      progress = THREE.MathUtils.lerp(progress, desiredProgress, reducedMotion ? 1 : 0.022);

      if (Math.abs(desiredProgress - progress) < 0.001) {
        progress = desiredProgress;
      }

      if (phaseRef.current === 'entering' && progress > 0.985) {
        updatePhase('inside');
      }

      world.update(time / 1000, progress, {
        cardSelected:
          phaseRef.current === 'card-selected' ||
          phaseRef.current === 'entering' ||
          phaseRef.current === 'inside',
        entering,
        focusedTarget: focusedRef.current,
      });

      const approachProgress = THREE.MathUtils.smoothstep(progress, 0.34, 0.72);

      const insideProgress = THREE.MathUtils.smoothstep(progress, 0.7, 1);

      const desiredPosition = world.overviewPosition
        .clone()
        .lerp(world.entrancePosition, approachProgress)
        .lerp(world.lobbyPosition, insideProgress);

      const desiredTarget = world.overviewTarget
        .clone()
        .lerp(world.entranceTarget, approachProgress)
        .lerp(world.lobbyTarget, insideProgress);

      currentPosition.lerp(desiredPosition, reducedMotion ? 1 : 0.08);
      currentTarget.lerp(desiredTarget, reducedMotion ? 1 : 0.08);

      world.camera.position.copy(currentPosition);
      world.camera.lookAt(currentTarget);

      renderer.render(world.scene, world.camera);

      animationFrame = requestAnimationFrame(render);
    }

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', handleResize);

    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);

      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      world.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="companyWorldExperience">
      <div className="companyWorldViewport" ref={mountRef} aria-hidden="true" />

      <div className="companyWorldBrand">
        <span className="companyWorldBrandMark">T6</span>
        <span>TRINITY6</span>
      </div>

      <div className="companyWorldStatus" aria-live="polite">
        <span
          className={['companyWorldStatusLight', phase === 'inside' ? 'isGranted' : '']
            .filter(Boolean)
            .join(' ')}
        />
        <span>{phase === 'inside' ? 'ACCESS GRANTED' : 'SECURE ENTRY'}</span>
      </div>

      <div className="companyWorldIntro">
        <p className="companyWorldEyebrow">Interactive company world</p>
        <h1>{phase === 'inside' ? 'Welcome inside.' : 'Explore the company.'}</h1>
        <p>
          {phase === 'inside'
            ? 'The lobby is the first step into the Trinity6 digital company.'
            : 'Touch a department to inspect it, or use the access card to enter the building.'}
        </p>

        <button type="button" onClick={presentCard}>
          {phase === 'overview'
            ? 'Select access card'
            : phase === 'card-selected'
              ? 'Present access card'
              : phase === 'inside'
                ? 'Return to overview'
                : 'Opening secure entrance…'}
        </button>
      </div>

      <div className="companyWorldSelection" aria-live="polite">
        {focusedTarget ? (
          <>
            <span>Selected</span>
            <strong>{targetLabels[focusedTarget]}</strong>
          </>
        ) : (
          <>
            <span>Explore</span>
            <strong>Tap a glowing system</strong>
          </>
        )}
      </div>

      {phase === 'card-selected' ? (
        <div className="companyWorldInstruction">
          Access card selected. Touch the entrance or use the button.
        </div>
      ) : null}

      <div className="srOnly">
        <h2>Trinity6 interactive company</h2>
        <p>A real-time 3D company building with interactive departments and secure access.</p>
      </div>
    </div>
  );
}
