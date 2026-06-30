/* DIARIO_CURSOWEBM: scripts interactivos extraidos desde index.html para mantenimiento. */

(() => {
        const ready = (callback) => {
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
          }
          callback();
        };

        const escapeCodeHtml = (value) =>
          value.replace(
            /[&<>"']/g,
            (character) =>
              ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
              })[character],
          );

        const wrapCodeToken = (codeClass, value) =>
          `<span class="${codeClass}">${escapeCodeHtml(value)}</span>`;

        const highlightJavaScript = (source) => {
          // Resaltador minimo compatible con las clases de Pandoc ya definidas en CSS.
          const keywords = new Set([
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "default",
            "else",
            "false",
            "finally",
            "for",
            "function",
            "if",
            "let",
            "new",
            "null",
            "return",
            "switch",
            "true",
            "var",
            "while",
          ]);
          const builtIns = new Set([
            "alert",
            "console",
            "document",
            "localStorage",
            "location",
            "Math",
            "window",
          ]);
          const tokenPattern =
            /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|[{}()[\].,;:+\-*/%<>=!&|?]+/g;
          let cursor = 0;
          let output = "";
          let match;

          while ((match = tokenPattern.exec(source))) {
            const token = match[0];
            output += escapeCodeHtml(source.slice(cursor, match.index));

            if (token.startsWith("//") || token.startsWith("/*")) {
              output += wrapCodeToken("co", token);
            } else if (/^['"`]/.test(token)) {
              output += wrapCodeToken("st", token);
            } else if (/^\d/.test(token)) {
              output += wrapCodeToken("dv", token);
            } else if (keywords.has(token)) {
              output += wrapCodeToken("kw", token);
            } else if (builtIns.has(token)) {
              output += wrapCodeToken("bu", token);
            } else if (/^[A-Za-z_$]/.test(token)) {
              const next = source.slice(tokenPattern.lastIndex).match(/^\s*\(/);
              output += next
                ? wrapCodeToken("fu", token)
                : escapeCodeHtml(token);
            } else {
              output += wrapCodeToken("op", token);
            }

            cursor = tokenPattern.lastIndex;
          }

          output += escapeCodeHtml(source.slice(cursor));
          return output;
        };

        const highlightHtmlTag = (tag) => {
          if (tag.startsWith("<!--")) {
            return wrapCodeToken("co", tag);
          }

          return escapeCodeHtml(tag)
            .replace(
              /\s([A-Za-z_:][\w:.-]*)(=)/g,
              ' <span class="at">$1</span><span class="op">$2</span>',
            )
            .replace(
              /(&quot;.*?&quot;|&#39;.*?&#39;)/g,
              '<span class="st">$1</span>',
            )
            .replace(
              /^(&lt;\/?)([A-Za-z][\w:-]*)/,
              '$1<span class="kw">$2</span>',
            );
        };

        const highlightHtml = (source) => {
          const tagPattern = new RegExp(
            "<!--[\\s\\S]*?-->|<\\/?[A-Za-z][^>]*?>",
            "g",
          );
          let cursor = 0;
          let output = "";
          let match;

          while ((match = tagPattern.exec(source))) {
            output += escapeCodeHtml(source.slice(cursor, match.index));
            output += highlightHtmlTag(match[0]);
            cursor = tagPattern.lastIndex;
          }

          output += escapeCodeHtml(source.slice(cursor));
          return output;
        };

        const highlightCss = (source) => {
          const tokenPattern =
            /\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%)?\b|[A-Za-z-]+(?=\s*:)|[{}():;,>+~*=.#]+/g;
          let cursor = 0;
          let output = "";
          let match;

          while ((match = tokenPattern.exec(source))) {
            const token = match[0];
            output += escapeCodeHtml(source.slice(cursor, match.index));

            if (token.startsWith("/*")) {
              output += wrapCodeToken("co", token);
            } else if (/^['"]/.test(token)) {
              output += wrapCodeToken("st", token);
            } else if (/^#/.test(token) || /^\d/.test(token)) {
              output += wrapCodeToken("dv", token);
            } else if (/^[A-Za-z-]+$/.test(token)) {
              output += wrapCodeToken("at", token);
            } else {
              output += wrapCodeToken("op", token);
            }

            cursor = tokenPattern.lastIndex;
          }

          output += escapeCodeHtml(source.slice(cursor));
          return output;
        };

        const highlightJson = (source) => {
          const tokenPattern =
            /"(?:\\.|[^"\\])*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b(?:true|false|null)\b|[{}\[\]:,]/g;
          let cursor = 0;
          let output = "";
          let match;

          while ((match = tokenPattern.exec(source))) {
            const token = match[0];
            output += escapeCodeHtml(source.slice(cursor, match.index));

            if (/^"/.test(token)) {
              const isKey = /^\s*:/.test(source.slice(tokenPattern.lastIndex));
              output += wrapCodeToken(isKey ? "at" : "st", token);
            } else if (/^-?\d/.test(token)) {
              output += wrapCodeToken("dv", token);
            } else if (/^(true|false|null)$/.test(token)) {
              output += wrapCodeToken("cn", token);
            } else {
              output += wrapCodeToken("op", token);
            }

            cursor = tokenPattern.lastIndex;
          }

          output += escapeCodeHtml(source.slice(cursor));
          return output;
        };

        const highlightJava = (source) => {
          const keywords = new Set([
            "boolean",
            "char",
            "class",
            "double",
            "false",
            "float",
            "import",
            "int",
            "new",
            "package",
            "private",
            "public",
            "return",
            "static",
            "true",
            "void",
          ]);
          const builtIns = new Set([
            "Scanner",
            "String",
            "System",
          ]);
          const tokenPattern =
            /\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?f?\b|\b[A-Za-z_$][\w$]*\b|[{}()[\].,;:+\-*/%<>=!&|?]+/g;
          let cursor = 0;
          let output = "";
          let match;

          while ((match = tokenPattern.exec(source))) {
            const token = match[0];
            output += escapeCodeHtml(source.slice(cursor, match.index));

            if (token.startsWith("//") || token.startsWith("/*")) {
              output += wrapCodeToken("co", token);
            } else if (/^['"]/.test(token)) {
              output += wrapCodeToken("st", token);
            } else if (/^\d/.test(token)) {
              output += wrapCodeToken("dv", token);
            } else if (keywords.has(token)) {
              output += wrapCodeToken("kw", token);
            } else if (builtIns.has(token)) {
              output += wrapCodeToken("bu", token);
            } else if (/^[A-Za-z_$]/.test(token)) {
              const next = source.slice(tokenPattern.lastIndex).match(/^\s*\(/);
              output += next
                ? wrapCodeToken("fu", token)
                : escapeCodeHtml(token);
            } else {
              output += wrapCodeToken("op", token);
            }

            cursor = tokenPattern.lastIndex;
          }

          output += escapeCodeHtml(source.slice(cursor));
          return output;
        };

        /**
         * Localiza la primera linea que debe mostrar un fragmento de codigo.
         *
         * Si en el futuro un bloque partido indica data-start-line o data-line-start,
         * la numeracion continua desde esa linea en vez de reiniciarse en 1.
         */
        const getCodeStartLine = (code) => {
          const carriers = [
            code,
            code?.closest("pre"),
            code?.closest("div.sourceCode"),
          ].filter(Boolean);

          for (const carrier of carriers) {
            const declaredStart =
              carrier.dataset?.startLine || carrier.dataset?.lineStart;
            const parsedStart = Number.parseInt(declaredStart, 10);

            if (Number.isFinite(parsedStart) && parsedStart > 0) {
              return parsedStart;
            }
          }

          const firstPandocLine = code?.querySelector(":scope > span[id]");
          const idMatch = firstPandocLine?.id?.match(/-(\d+)$/);
          const parsedIdLine = Number.parseInt(idMatch?.[1], 10);

          return Number.isFinite(parsedIdLine) && parsedIdLine > 0
            ? parsedIdLine
            : 1;
        };

        /**
         * Calcula cuantas lineas visibles tiene un bloque sin modificar sus spans.
         *
         * Se elimina solo el salto final artificial para no mostrar una linea vacia
         * que no pertenece al codigo escrito.
         */
        const getCodeLineCount = (code) => {
          const source = code?.textContent?.replace(/\n$/, "") || "";
          return Math.max(source.split("\n").length, 1);
        };

        /**
         * Dibuja el margen de numeros de linea sin tocar el codigo interno.
         *
         * Esto preserva el resaltado de Pandoc, el resaltado propio y los bloques
         * dinamicos que cambian al pulsar botones en los laboratorios.
         */
        const applyCodeLineNumbers = (code) => {
          const pre = code?.closest("pre");

          if (!code || !pre) {
            return;
          }

          const startLine = getCodeStartLine(code);
          const lineCount = getCodeLineCount(code);
          const lineNumbers = Array.from(
            { length: lineCount },
            (_, index) => String(startLine + index),
          ).join("\n");
          let gutter = pre.querySelector(":scope > .code-line-gutter");

          if (!gutter) {
            gutter = document.createElement("span");
            gutter.className = "code-line-gutter";
            gutter.setAttribute("aria-hidden", "true");
            pre.prepend(gutter);
          }

          pre.classList.add("code-with-lines");
          code.dataset.lineStart = String(startLine);
          gutter.textContent = lineNumbers;
        };

        const highlightCodeElement = (code) => {
          if (!code) {
            return;
          }

          // Evita recolorear bloques que ya traen spans de Pandoc desde la generacion.
          if (!code.querySelector("span")) {
            const language = Array.from(code.classList)
              .find((className) => className !== "sourceCode")
              ?.toLowerCase();
            const source = code.textContent;

            if (language === "javascript" || language === "js") {
              code.innerHTML = highlightJavaScript(source);
            } else if (language === "java") {
              code.innerHTML = highlightJava(source);
            } else if (language === "html" || language === "xml") {
              code.innerHTML = highlightHtml(source);
            } else if (language === "css") {
              code.innerHTML = highlightCss(source);
            } else if (language === "json") {
              code.innerHTML = highlightJson(source);
            }
          }

          applyCodeLineNumbers(code);
        };

        const highlightPlainCodeBlocks = () => {
          document
            .querySelectorAll("code.sourceCode")
            .forEach(highlightCodeElement);
        };

        /**
         * Asegura que todos los paneles de codigo muestren la pastilla de lenguaje.
         *
         * Algunos bloques antiguos traen el badge escrito en el HTML y otros solo
         * declaran data-language-label. Esta normalizacion evita editar cada bloque
         * manualmente y mantiene una salida visual consistente.
         */
        const ensureCodeLanguageBadges = () => {
          document
            .querySelectorAll("div.sourceCode.code-panel[data-language-label]")
            .forEach((panel) => {
              if (panel.querySelector(":scope > .code-language-badge")) {
                return;
              }

              const badge = document.createElement("div");
              badge.className = "code-language-badge";
              badge.setAttribute("aria-hidden", "true");
              badge.textContent = panel.dataset.languageLabel;
              panel.insertBefore(badge, panel.firstElementChild);
            });
        };

        /**
         * Convierte cada panel de codigo en una vista ampliable a ancho completo.
         *
         * En reposo mantiene el scroll horizontal normal. En modo ampliado el
         * codigo envuelve lineas para estudiar fragmentos largos sin barra lateral.
         */
        const enableExpandableCodePanels = () => {
          const panels = document.querySelectorAll("div.sourceCode.code-panel");

          const panelHasHorizontalOverflow = (panel) => {
            const pre = panel.querySelector(":scope > pre");
            return Boolean(pre && pre.scrollWidth > pre.clientWidth + 2);
          };

          const clearPanelExpansionMetrics = (panel) => {
            panel.classList.remove("is-code-wrapped");
            panel.style.removeProperty("--code-expand-width");
            panel.style.removeProperty("--code-expand-margin-left");
            panel.style.removeProperty("--code-expanded-min-width");
          };

          const setSmartPanelExpansion = (panel) => {
            const pre = panel.querySelector(":scope > pre");

            if (!pre) {
              clearPanelExpansionMetrics(panel);
              return;
            }

            const panelRect = panel.getBoundingClientRect();
            const viewportPadding = 16;
            const maximumWidth = Math.max(
              panelRect.width,
              window.innerWidth - viewportPadding * 2,
            );
            const requiredWidth = Math.ceil(
              panelRect.width + Math.max(0, pre.scrollWidth - pre.clientWidth),
            );
            const targetWidth = Math.min(requiredWidth, maximumWidth);
            const leftLimit = viewportPadding;
            const rightLimit = window.innerWidth - viewportPadding;
            const currentLeft = panelRect.left;
            const centeredLeft = currentLeft - (targetWidth - panelRect.width) / 2;
            const targetLeft = Math.min(
              Math.max(centeredLeft, leftLimit),
              rightLimit - targetWidth,
            );
            const marginLeft = Math.round(targetLeft - currentLeft);

            panel.style.setProperty("--code-expand-width", `${Math.ceil(targetWidth)}px`);
            panel.style.setProperty("--code-expand-margin-left", `${marginLeft}px`);
            panel.style.setProperty("--code-expanded-min-width", `${Math.ceil(pre.scrollWidth)}px`);
            panel.classList.toggle("is-code-wrapped", requiredWidth > maximumWidth);
          };

          const updatePanelExpandableState = (panel) => {
            const isExpandable =
              panel.classList.contains("is-expanded") ||
              panelHasHorizontalOverflow(panel);

            panel.classList.toggle("is-code-expandable", isExpandable);

            if (isExpandable) {
              panel.setAttribute("role", "button");
              panel.setAttribute("tabindex", "0");
              panel.setAttribute(
                "aria-label",
                "Ampliar bloque de codigo a ancho completo",
              );
              panel.setAttribute(
                "aria-expanded",
                panel.classList.contains("is-expanded") ? "true" : "false",
              );
            } else {
              panel.removeAttribute("role");
              panel.removeAttribute("tabindex");
              panel.removeAttribute("aria-label");
              panel.removeAttribute("aria-expanded");
            }
          };

          const collapseExpandedPanel = () => {
            const expanded = document.querySelector(
              "div.sourceCode.code-panel.is-expanded",
            );

            if (!expanded) {
              return;
            }

            expanded.classList.remove("is-expanded");
            expanded.setAttribute("aria-expanded", "false");
            clearPanelExpansionMetrics(expanded);
            updatePanelExpandableState(expanded);
          };

          const togglePanel = (panel) => {
            if (!panel.classList.contains("is-code-expandable")) {
              return;
            }

            const isExpanded = panel.classList.contains("is-expanded");
            collapseExpandedPanel();

            if (isExpanded) {
              return;
            }

            panel.classList.add("is-expanded");
            setSmartPanelExpansion(panel);
            panel.setAttribute("aria-expanded", "true");
            panel.focus({ preventScroll: true });
          };

          panels.forEach((panel) => {
            if (panel.dataset.expandableReady === "true") {
              return;
            }

            panel.dataset.expandableReady = "true";
            updatePanelExpandableState(panel);

            panel.addEventListener("click", () => togglePanel(panel));
            panel.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                togglePanel(panel);
              }
            });
          });

          document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
              collapseExpandedPanel();
            }
          });

          window.addEventListener("resize", () => {
            panels.forEach((panel) => {
              if (panel.classList.contains("is-expanded")) {
                setSmartPanelExpansion(panel);
              }
              updatePanelExpandableState(panel);
            });
          });
        };

        /**
         * Devuelve una version corta y legible de un texto largo para fichas de estudio.
         */
        const compactStudyText = (value, maxLength = 190) => {
          const normalized = (value || "").replace(/\s+/g, " ").trim();
          if (normalized.length <= maxLength) {
            return normalized;
          }
          return `${normalized.slice(0, maxLength - 1).trim()}...`;
        };

        /**
         * Construye una ficha transversal para que cada dia sea estudiable de un vistazo.
         */
        const buildDayStudyCards = () => {
          document.querySelectorAll("section.level1.day-section").forEach((day) => {
            if (day.querySelector(":scope > .day-study-card")) {
              return;
            }

            const heading = day.querySelector(":scope > h1");
            if (!heading) {
              return;
            }

            const intro = day.querySelector(":scope > p:not(.status-pill)");
            const objective =
              day.querySelector(':scope section[id^="objetivo-del-dia"] p') ||
              day.querySelector(':scope section[id^="mapa-de-estudio-dia"] p') ||
              intro;
            const defaultFeatures = [
              ["Mapa", day.querySelector(':scope section[id^="mapa-de-estudio-dia"]')],
              ["Microlección", day.querySelector(":scope .micro-lesson")],
              ["Código", day.querySelector(":scope .sourceCode")],
              ["Laboratorio", day.querySelector(":scope .interactive-lab")],
              ["Errores", day.querySelector(':scope section[id^="errores-frecuentes"]')],
              ["Preguntas", day.querySelector(':scope section[id^="preguntas-con-respuesta"]')],
              ["Cierre", day.querySelector(':scope section[id^="cierre-del-dia"]')],
            ];
            const day22Features = [
              ["Mapa", day.querySelector(':scope section[id^="mapa-de-estudio-dia"]')],
              ["Ruta de estudio", day.querySelector(":scope #ruta-de-estudio-dia-22")],
              ["Conceptos base", day.querySelector(":scope #conceptos-base-dia-22")],
              ["Principios POUR", day.querySelector(":scope #principios-wcag-dia-22")],
              ["Usabilidad y Nielsen", day.querySelector(":scope #heuristicas-nielsen-dia-22")],
              ["HTML nativo", day.querySelector(":scope #patrones-accesibles-dia-22")],
              ["WAI-ARIA", day.querySelector(":scope #concepto-aria-dia-22")],
              ["Código", day.querySelector(":scope .sourceCode")],
              ["Herramientas", day.querySelector(":scope #herramientas-evaluacion-accesibilidad-dia-22")],
              ["Laboratorio", day.querySelector(":scope .interactive-lab")],
              ["Errores", day.querySelector(':scope section[id^="errores-frecuentes"]')],
              ["Preguntas", day.querySelector(':scope section[id^="preguntas-con-respuesta"]')],
              ["Cierre", day.querySelector(':scope section[id^="cierre-del-dia"]')],
            ];
            const features =
              day.id === "dia-22---accesibilidad-usabilidad-y-diseno-universal"
                ? day22Features
                : defaultFeatures;
            const card = document.createElement("aside");
            card.className = "day-study-card";
            card.setAttribute("aria-label", "Ficha de estudio del capitulo");
            card.innerHTML = `
              <div>
                <strong>Ficha de estudio</strong>
                <p>${escapeCodeHtml(compactStudyText(objective?.textContent || heading.textContent))}</p>
              </div>
              <ul>
                ${features
                  .map(
                    ([label, present]) =>
                      `<li class="${present ? "is-present" : "is-missing"}">${label}</li>`,
                  )
                  .join("")}
              </ul>
              <p class="study-next"><b>Lectura guiada:</b> concepto clave, codigo que lo demuestra, resultado visible y error que conviene reconocer.</p>
            `;

            heading.insertAdjacentElement("afterend", card);
          });
        };

        /**
         * Abre una captura en una ventana nueva con una pagina minima de lectura.
         */
        const openImageInNewWindow = (image, title) => {
          const source = image.currentSrc || image.src || image.getAttribute("src");
          if (!source) {
            return;
          }

          const safeTitle = escapeCodeHtml(title || image.alt || "Vista esperada");
          const safeSource = escapeCodeHtml(source);
          const popup = window.open("", "_blank");
          if (!popup) {
            const fallbackLink = document.createElement("a");
            fallbackLink.href = source;
            fallbackLink.target = "_blank";
            fallbackLink.rel = "noopener noreferrer";
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            fallbackLink.remove();
            return;
          }

          popup.opener = null;
          popup.document.write(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      html, body {
        margin: 0;
        min-height: 100%;
        background: #0f172a;
        color: #f8fafc;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        display: grid;
        gap: 16px;
        padding: 18px;
      }
      header {
        align-items: center;
        display: flex;
        justify-content: space-between;
        gap: 16px;
      }
      h1 {
        font-size: 1rem;
        line-height: 1.25;
        margin: 0;
      }
      img {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 22px 70px rgba(0, 0, 0, 0.35);
        display: block;
        height: auto;
        margin: 0 auto;
        max-height: calc(100vh - 86px);
        max-width: 100%;
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    <header><h1>${safeTitle}</h1></header>
    <img alt="${safeTitle}" src="${safeSource}" />
  </body>
</html>`);
          popup.document.close();
        };

        /**
         * Sustituye las capturas de "Vista esperada en navegador" por una apertura externa.
         */
        const externalizeExpectedBrowserViews = () => {
          document
            .querySelectorAll('section.visual-panel[id^="vista-esperada-en-navegador"]')
            .forEach((section) => {
              const figure = section.querySelector(
                ':scope > figure:not([data-pdf-preview])',
              );
              const image = figure?.querySelector("img");
              if (!figure || !image || section.querySelector(".external-view-card")) {
                return;
              }

              const heading = section.querySelector(":scope > h2");
              const caption = figure.querySelector("figcaption")?.textContent.trim();
              const title =
                heading?.textContent.trim() ||
                image.alt ||
                "Vista esperada en navegador";
              const card = document.createElement("div");
              card.className = "external-view-card";
              card.innerHTML = `
                <div>
                  <strong>${escapeCodeHtml(title)}</strong>
                  <p>${escapeCodeHtml(
                    caption ||
                      "La captura se abre fuera del diario para mantener limpia la lectura.",
                  )}</p>
                </div>
                <button class="external-view-open" type="button">Abrir vista en ventana nueva</button>
              `;

              card
                .querySelector(".external-view-open")
                ?.addEventListener("click", () => openImageInNewWindow(image, title));
              figure.replaceWith(card);
            });
        };

        /**
         * Permite inspeccionar capturas completas dentro del documento sin abrir otra pestaña.
         */
        const setupVisualImageViewer = () => {
          const images = document.querySelectorAll(
            ".visual-panel figure:not([data-pdf-preview]) img",
          );
          if (!images.length || document.querySelector(".image-viewer")) {
            return;
          }

          const viewer = document.createElement("div");
          viewer.className = "image-viewer";
          viewer.hidden = true;
          viewer.innerHTML = `
            <div class="image-viewer-backdrop" data-image-viewer-close></div>
            <div class="image-viewer-panel" role="dialog" aria-modal="true" aria-label="Imagen ampliada">
              <div class="image-viewer-toolbar">
                <p class="image-viewer-title" data-image-viewer-title>Imagen ampliada</p>
                <button class="image-viewer-close" type="button" data-image-viewer-close aria-label="Cerrar imagen ampliada">Cerrar</button>
              </div>
              <img alt="" data-image-viewer-img loading="lazy" decoding="async">
            </div>
          `;
          document.body.appendChild(viewer);

          const viewerImage = viewer.querySelector("[data-image-viewer-img]");
          const viewerTitle = viewer.querySelector("[data-image-viewer-title]");
          const closeButton = viewer.querySelector(".image-viewer-close");
          let lastFocusedElement = null;

          const closeViewer = () => {
            viewer.hidden = true;
            viewerImage.removeAttribute("src");
            lastFocusedElement?.focus?.();
          };

          const openViewer = (image) => {
            lastFocusedElement = document.activeElement;
            viewerImage.src = image.currentSrc || image.src;
            viewerImage.alt = image.alt || "Imagen ampliada";
            viewerTitle.textContent = image.alt || "Imagen ampliada";
            viewer.hidden = false;
            closeButton.focus();
          };

          viewer.addEventListener("click", (event) => {
            if (event.target.closest("[data-image-viewer-close]")) {
              closeViewer();
            }
          });

          document.addEventListener("keydown", (event) => {
            if (!viewer.hidden && event.key === "Escape") {
              closeViewer();
            }
          });

          images.forEach((image) => {
            image.setAttribute("role", "button");
            image.setAttribute("tabindex", "0");
            image.setAttribute("aria-label", "Abrir imagen completa");
            image.addEventListener("click", () => openViewer(image));
            image.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openViewer(image);
              }
            });
          });
        };

        /**
         * Sustituye capturas de ejercicios por la ejecucion del HTML fuente real.
         */
        const setupLiveSourcePreviews = () => {
          const resizePreviewFrame = (iframe) => {
            const applyMeasuredHeight = () => {
              try {
                const frameDocument =
                  iframe.contentDocument || iframe.contentWindow?.document;
                const root = frameDocument?.documentElement;
                const body = frameDocument?.body;
                const frameWindow = iframe.contentWindow;
                const previewElements = Array.from(
                  body?.querySelectorAll("*") || [],
                );
                const structuralBottom = Array.from(body?.children || []).reduce(
                  (maximum, element) => {
                    const rect = element.getBoundingClientRect();
                    const styles = frameWindow?.getComputedStyle(element);
                    const marginBottom = Number.parseFloat(
                      styles?.marginBottom || "0",
                    );
                    return Math.max(maximum, rect.bottom + marginBottom);
                  },
                  0,
                );
                const meaningfulBottom = previewElements.reduce(
                  (maximum, element) => {
                    const tagName = element.tagName;
                    if (
                      ["SCRIPT", "STYLE", "LINK", "META", "TITLE"].includes(
                        tagName,
                      )
                    ) {
                      return maximum;
                    }

                    const rect = element.getBoundingClientRect();
                    const styles = frameWindow?.getComputedStyle(element);
                    if (
                      !styles ||
                      rect.width <= 0 ||
                      rect.height <= 0 ||
                      styles.display === "none" ||
                      styles.visibility === "hidden"
                    ) {
                      return maximum;
                    }

                    const hasOwnText = Array.from(element.childNodes).some(
                      (node) =>
                        node.nodeType === 3 && node.textContent.trim().length,
                    );
                    const isStudyElement = [
                      "A",
                      "BUTTON",
                      "CANVAS",
                      "IMG",
                      "INPUT",
                      "SELECT",
                      "SVG",
                      "TABLE",
                      "TEXTAREA",
                      "VIDEO",
                    ].includes(tagName);
                    const paintsBox =
                      styles.backgroundImage !== "none" ||
                      !["rgba(0, 0, 0, 0)", "transparent"].includes(
                        styles.backgroundColor,
                      ) ||
                      styles.borderStyle !== "none";
                    const isLeafVisual =
                      element.children.length === 0 && paintsBox;
                    const isViewportContainer =
                      element.children.length > 0 &&
                      rect.height >= (frameWindow?.innerHeight || 0) * 0.8;

                    if (
                      !isStudyElement &&
                      !hasOwnText &&
                      !isLeafVisual &&
                      (!paintsBox || isViewportContainer)
                    ) {
                      return maximum;
                    }

                    const marginBottom = Number.parseFloat(
                      styles.marginBottom || "0",
                    );
                    return Math.max(maximum, rect.bottom + marginBottom);
                  },
                  0,
                );
                const contentHeight = Math.max(
                  meaningfulBottom || structuralBottom,
                  root?.scrollHeight > (root?.clientHeight || 0)
                    ? root.scrollHeight
                    : 0,
                  body?.scrollHeight > (body?.clientHeight || 0)
                    ? body.scrollHeight
                    : 0,
                );

                if (!contentHeight) {
                  return;
                }

                root.style.overflow = "hidden";
                body.style.overflow = "hidden";
                iframe.setAttribute("scrolling", "no");
                iframe.style.overflow = "hidden";

                const compactHeight = Math.min(
                  Math.max(Math.ceil(contentHeight) + 32, 120),
                  920,
                );
                iframe.style.height = `${compactHeight}px`;
              } catch {
                iframe.dataset.autoHeight = "unavailable";
              }
            };

            iframe.addEventListener("load", () => {
              applyMeasuredHeight();
              window.setTimeout(applyMeasuredHeight, 160);
              window.setTimeout(applyMeasuredHeight, 500);
            });
          };

          document.querySelectorAll("section.level2").forEach((section) => {
            if (section.querySelector("[data-pdf-preview]")) {
              return;
            }

            const figure = section.querySelector(":scope > figure");
            const image = figure?.querySelector("img");
            const trace =
              section.querySelector(".trace-card") ||
              Array.from(section.querySelectorAll(":scope > p")).find(
                (paragraph) =>
                  paragraph.textContent.includes("Fuente visual:") ||
                  paragraph.textContent.includes("HTML usado:"),
              );
            if (!figure || !image || !trace) {
              return;
            }

            const sourcePath = Array.from(trace.querySelectorAll("code"))
              .map((code) => code.textContent.trim())
              .find((text) => /^profe\/f11web\/.+\.html$/i.test(text));

            if (!sourcePath) {
              return;
            }

            // GitHub Pages no publica la carpeta profe; conserva la captura para evitar iframes 404.
            if (sourcePath.startsWith("profe/")) {
              trace.querySelectorAll("br").forEach((br) => {
                const textNode = br.nextSibling;
                if (
                  textNode?.nodeType === Node.TEXT_NODE &&
                  textNode.textContent.includes("Tipo de vista:")
                ) {
                  textNode.textContent =
                    " Tipo de vista: captura validada; fuente real no publicada en GitHub Pages";
                }
              });
              return;
            }

            const title =
              image.getAttribute("alt") ||
              section.querySelector("h2")?.textContent.trim() ||
              "Vista real del ejercicio";
            const preview = document.createElement("div");
            preview.className = "live-source-preview is-external-only";
            preview.dataset.liveSource = sourcePath;
            preview.innerHTML = `
              <div class="live-source-toolbar">
                <span class="live-source-path">HTML real: <code>${escapeCodeHtml(sourcePath)}</code></span>
                <a class="live-source-open" href="${sourcePath}" target="_blank" rel="noopener">Abrir vista en ventana nueva</a>
              </div>
              <p class="live-source-note">La vista se abre fuera del diario para mantener limpia la lectura.</p>
            `;

            figure.replaceWith(preview);
            trace.querySelectorAll("br").forEach((br) => {
              const textNode = br.nextSibling;
              if (
                textNode?.nodeType === Node.TEXT_NODE &&
                textNode.textContent.includes("Tipo de vista:")
              ) {
                textNode.textContent =
                  " Tipo de vista: vista real local ejecutada desde el HTML fuente";
              }
            });
          });
        };

        /**
         * Abre referencias PDF dentro del diario cuando el navegador soporta visor embebido.
         */
        const setupInlinePdfViewers = () => {
          document.querySelectorAll("[data-pdf-toggle]").forEach((button) => {
            const card = button.closest("[data-pdf-source]");
            const panel = card?.querySelector("[data-pdf-panel]");
            if (!panel) {
              return;
            }

            button.addEventListener("click", () => {
              const shouldOpen = panel.hidden;
              panel.hidden = !shouldOpen;
              button.textContent = shouldOpen ? "Cerrar PDF" : "Abrir PDF aquí";
              button.setAttribute(
                "aria-expanded",
                shouldOpen ? "true" : "false",
              );
            });
          });
        };

        ready(() => {
          buildDayStudyCards();
          setupLiveSourcePreviews();
          setupVisualImageViewer();
          setupInlinePdfViewers();
          highlightPlainCodeBlocks();
          ensureCodeLanguageBadges();
          enableExpandableCodePanels();
          document.querySelectorAll("[data-code-toggle]").forEach((button) => {
            const lab = button.closest(".interactive-lab");
            const panel = lab?.querySelector("[data-code-panel]");
            if (!panel) {
              return;
            }
            button.addEventListener("click", () => {
              const shouldOpen = panel.hidden;
              panel.hidden = !shouldOpen;
              button.textContent = shouldOpen ? "Ocultar codigo" : "Ver codigo";
              button.setAttribute(
                "aria-expanded",
                shouldOpen ? "true" : "false",
              );
            });
          });

          document.querySelectorAll('[data-lab="api-http"]').forEach((lab) => {
            const endpoint = lab.querySelector("[data-api-url]");
            const status = lab.querySelector("[data-api-status]");
            const contentType = lab.querySelector("[data-api-content-type]");
            const result = lab.querySelector("[data-api-result]");
            const feedback = lab.querySelector("[data-api-feedback]");
            const bodyPreview = lab.querySelector("[data-api-body-preview]");
            const cards = lab.querySelectorAll("[data-api-step]");
            const states = {
              endpoint: {
                activeStep: "url",
                body: `const URL_RUTA =
  "https://itunes.apple.com/search?media=music&term=acdc";`,
                contentType: "pendiente",
                endpoint: "iTunes Search API",
                feedback:
                  "El endpoint de iTunes es la direccion del servicio web. Todavia no hay respuesta porque aun no se ha lanzado la peticion.",
                result: "URL_RUTA",
                status: "sin peticion",
              },
              request: {
                activeStep: "method",
                body: `fetch(URL_RUTA).then(respuesta => {
  console.log("RESPUESTA RECIBIDA");
  console.log("Objeto response completo:", respuesta);
})`,
                contentType: "pendiente de respuesta",
                endpoint: "iTunes Search API",
                feedback:
                  "fetch(URL_RUTA) prepara una peticion HTTP. Como no se indica metodo, el navegador usa GET.",
                result: "Promise<Response>",
                status: "peticion enviada",
              },
              headers: {
                activeStep: "response",
                body: `Response {
  ok: true,
  status: 200,
  headers: Content-Type
}`,
                contentType: "application/json; charset=utf-8",
                endpoint: "iTunes Search API",
                feedback:
                  "Cuando llega la respuesta, headers contiene informacion de control como tipo MIME, cache u origen.",
                result: "respuesta.headers",
                status: "200 OK",
              },
              json: {
                activeStep: "body",
                body: `{
  "resultCount": 50,
  "results": [
    { "artistName": "AC/DC", "trackName": "Thunderstruck" }
  ]
}`,
                contentType: "application/json; charset=utf-8",
                endpoint: "iTunes Search API",
                feedback:
                  "response.json() deserializa el texto JSON: pasa de cuerpo de respuesta a variable JavaScript.",
                result: "arrayCanciones",
                status: "200 OK",
              },
              alumnos: {
                activeStep: "url",
                body: `const URL_RUTA =
  "https://my-json-server.typicode.com/valexx55/angularesjson/alumno";`,
                contentType: "application/json; charset=utf-8",
                endpoint: "my-json-server / alumno",
                feedback:
                  "El endpoint de alumnos remotos sirve como comparacion: cambia la ruta y la forma del JSON, pero se mantiene el mismo recorrido fetch -> Response -> json().",
                result: "arrayAlumnos",
                status: "200 OK",
              },
            };

            const renderApiState = (stateName) => {
              const state = states[stateName] || states.endpoint;
              endpoint.textContent = state.endpoint;
              status.textContent = state.status;
              contentType.textContent = state.contentType;
              result.textContent = state.result;
              feedback.textContent = state.feedback;
              bodyPreview.textContent = state.body;
              highlightCodeElement(bodyPreview);

              lab.querySelectorAll("[data-api-state]").forEach((button) => {
                const active = button.dataset.apiState === stateName;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", active ? "true" : "false");
              });

              // Solo una tarjeta se marca como foco para que el recorrido visual sea claro.
              cards.forEach((card) => {
                card.classList.toggle(
                  "is-active",
                  card.dataset.apiStep === state.activeStep,
                );
              });
            };

            lab.addEventListener("click", (event) => {
              const button = event.target.closest("[data-api-state]");
              if (!button) {
                return;
              }
              renderApiState(button.dataset.apiState);
            });

            renderApiState("endpoint");
          });

          document.querySelectorAll('[data-lab="json-server"]').forEach((lab) => {
            const resource = lab.querySelector("[data-json-resource]");
            const method = lab.querySelector("[data-json-method]");
            const url = lab.querySelector("[data-json-url]");
            const bodyState = lab.querySelector("[data-json-body-state]");
            const status = lab.querySelector("[data-json-status]");
            const contentType = lab.querySelector("[data-json-content-type]");
            const result = lab.querySelector("[data-json-result]");
            const feedback = lab.querySelector("[data-json-feedback]");
            const bodyPreview = lab.querySelector("[data-json-body-preview]");
            const cards = lab.querySelectorAll("[data-json-step]");
            const states = {
              resource: {
                activeStep: "resource",
                body: `{
  "alumno": [
    { "id": 12, "nombre": "Vinicius Pele", "edad": 20 }
  ]
}`,
                bodyState: "array alumno",
                contentType: "pendiente",
                feedback:
                  "La clave alumno del db.json del profesor genera el recurso /alumno.",
                method: "sin petición",
                resource: "alumno",
                result: "alumno[]",
                status: "sin petición",
                url: "/alumno",
              },
              server: {
                activeStep: "method",
                body: `cd profe/f11web/JS/JSONSERVER
npx json-server --watch db.json --port 3005`,
                bodyState: "servidor activo",
                contentType: "application/json",
                feedback:
                  "JSON Server publica el db.json como API local en el puerto 3005.",
                method: "json-server",
                resource: "alumno",
                result: "http://localhost:3005/alumno",
                status: "servidor local",
                url: "localhost:3005",
              },
              fetch: {
                activeStep: "url",
                body: `const URL_RUTA = "http://localhost:3005/alumno";

fetch(URL_RUTA)`,
                bodyState: "sin body",
                contentType: "pendiente de respuesta",
                feedback:
                  "fetch(URL_RUTA) hace una petición GET porque no se indica otro método.",
                method: "GET por defecto",
                resource: "alumno",
                result: "Promise<Response>",
                status: "petición enviada",
                url: "http://localhost:3005/alumno",
              },
              json: {
                activeStep: "body",
                body: `fetch(URL_RUTA)
  .then(response => response.json())
  .then(arrayAlumnos => mostrarAlumnos(arrayAlumnos));`,
                bodyState: "JSON convertido",
                contentType: "application/json",
                feedback:
                  "response.json() deserializa el cuerpo: pasa de texto JSON a array usable en JavaScript.",
                method: "GET",
                resource: "alumno",
                result: "arrayAlumnos",
                status: "200 OK",
                url: "http://localhost:3005/alumno",
              },
              dom: {
                activeStep: "body",
                body: `const contenedor = document.getElementById("lista-alumnos");

arrayAlumnos.forEach(alumno => {
  const li = document.createElement("li");
  li.textContent = \`Nombre: \${alumno.nombre} - Edad: \${alumno.edad} años\`;
  contenedor.appendChild(li);
});`,
                bodyState: "li creados",
                contentType: "DOM actualizado",
                feedback:
                  "mostrarAlumnos convierte cada objeto recibido en un li dentro del ul del HTML.",
                method: "forEach",
                resource: "lista-alumnos",
                result: "<li> por alumno",
                status: "pintado en pantalla",
                url: "document.getElementById",
              },
            };

            const renderJsonServerState = (stateName) => {
              const state = states[stateName] || states.resource;
              resource.textContent = state.resource;
              method.textContent = state.method;
              url.textContent = state.url;
              bodyState.textContent = state.bodyState;
              status.textContent = state.status;
              contentType.textContent = state.contentType;
              result.textContent = state.result;
              feedback.textContent = state.feedback;
              bodyPreview.textContent = state.body;
              highlightCodeElement(bodyPreview);

              lab.querySelectorAll("[data-json-state]").forEach((button) => {
                const active = button.dataset.jsonState === stateName;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", active ? "true" : "false");
              });

              cards.forEach((card) => {
                card.classList.toggle(
                  "is-active",
                  card.dataset.jsonStep === state.activeStep,
                );
              });
            };

            lab.addEventListener("click", (event) => {
              const button = event.target.closest("[data-json-state]");
              if (!button) {
                return;
              }
              renderJsonServerState(button.dataset.jsonState);
            });

            renderJsonServerState("resource");
          });

          document.querySelectorAll('[data-lab="geolocation"]').forEach((lab) => {
            const radar = lab.querySelector("[data-geo-radar]");
            const label = lab.querySelector("[data-geo-label]");
            const permission = lab.querySelector("[data-geo-permission]");
            const mode = lab.querySelector("[data-geo-mode]");
            const lat = lab.querySelector("[data-geo-lat]");
            const lon = lab.querySelector("[data-geo-lon]");
            const accuracy = lab.querySelector("[data-geo-accuracy]");
            const samples = lab.querySelector("[data-geo-samples]");
            const feedback = lab.querySelector("[data-geo-feedback]");
            const states = {
              permission: {
                accuracy: "sin datos",
                feedback:
                  "Antes de recibir coordenadas, el navegador necesita permiso del usuario y un contexto compatible.",
                label: "Esperando permiso",
                lat: "--.------",
                lon: "--.------",
                mode: "sin lectura",
                permission: "prompt",
                radar: "permission",
                samples: "0",
              },
              single: {
                accuracy: "24 m",
                feedback:
                  "getCurrentPosition() pide una lectura puntual: si el usuario acepta, llega un objeto con coords.latitude y coords.longitude.",
                label: "Lectura puntual",
                lat: "40.416775",
                lon: "-3.703790",
                mode: "getCurrentPosition()",
                permission: "granted",
                radar: "single",
                samples: "1",
              },
              watch: {
                accuracy: "18 m",
                feedback:
                  "watchPosition() mantiene una escucha viva y entrega nuevas muestras hasta detenerla con clearWatch().",
                label: "Seguimiento activo",
                lat: "40.417120",
                lon: "-3.704050",
                mode: "watchPosition()",
                permission: "granted",
                radar: "watch",
                samples: "5",
              },
              error: {
                accuracy: "no disponible",
                feedback:
                  "El error tambien forma parte del flujo: puede faltar permiso, señal o tiempo de respuesta.",
                label: "Sin acceso",
                lat: "--.------",
                lon: "--.------",
                mode: "callback de error",
                permission: "denied",
                radar: "error",
                samples: "0",
              },
              map: {
                accuracy: "20 m",
                feedback:
                  "Con latitud y longitud ya se puede preparar un mapa, una URL de tiempo o cualquier peticion que necesite ubicacion.",
                label: "Coordenadas listas",
                lat: "40.416775",
                lon: "-3.703790",
                mode: "usar coordenadas",
                permission: "granted",
                radar: "map",
                samples: "1",
              },
            };

            const renderGeoState = (stateName) => {
              const state = states[stateName] || states.permission;
              radar.dataset.state = state.radar;
              label.textContent = state.label;
              permission.textContent = state.permission;
              mode.textContent = state.mode;
              lat.textContent = state.lat;
              lon.textContent = state.lon;
              accuracy.textContent = state.accuracy;
              samples.textContent = state.samples;
              feedback.textContent = state.feedback;

              lab.querySelectorAll("[data-geo-state]").forEach((button) => {
                const active = button.dataset.geoState === stateName;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", active ? "true" : "false");
              });
            };

            lab.addEventListener("click", (event) => {
              const button = event.target.closest("[data-geo-state]");
              if (!button) {
                return;
              }
              renderGeoState(button.dataset.geoState);
            });

            renderGeoState("permission");
          });



          document.querySelectorAll('[data-lab="rps-mini"]').forEach((lab) => {
            const WINNING_SCORE = 5;
            const choices = ["piedra", "papel", "tijera"];
            const score = {
              jugador: 0,
              maquina: 0,
            };
            let gameFinished = false;
            const scoreViews = {
              jugador: lab.querySelector('[data-rps-score="jugador"]'),
              maquina: lab.querySelector('[data-rps-score="maquina"]'),
            };
            const scoreBoxes = {
              jugador: lab.querySelector('[data-rps-score-box="jugador"]'),
              maquina: lab.querySelector('[data-rps-score-box="maquina"]'),
            };
            const choiceViews = {
              jugador: lab.querySelector('[data-rps-view="jugador"]'),
              maquina: lab.querySelector('[data-rps-view="maquina"]'),
            };
            const symbolViews = {
              jugador: lab.querySelector('[data-rps-symbol="jugador"]'),
              maquina: lab.querySelector('[data-rps-symbol="maquina"]'),
            };
            const choiceBoxes = {
              jugador: lab.querySelector('[data-rps-choice-box="jugador"]'),
              maquina: lab.querySelector('[data-rps-choice-box="maquina"]'),
            };
            const result = lab.querySelector("[data-rps-result]");

            const titleCaseChoice = (choice) =>
              choice.charAt(0).toUpperCase() + choice.slice(1);

            const RPS_IMAGE_SOURCES = {"piedra": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBpZWRyYSI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMGYxNzJhIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41NSIgc3RvcC1jb2xvcj0iIzE1NWU3NSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxZDRlZDgiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiByeD0iNDQiIGZpbGw9InVybCgjZykiLz4KICA8Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMDIiIHI9IjU4IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMTQpIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4zMikiIHN0cm9rZS13aWR0aD0iNCIvPgogIDx0ZXh0IHg9IjEyOCIgeT0iMTIzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iU2Vnb2UgVUkgRW1vamksIEFwcGxlIENvbG9yIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9Ijc4Ij7inIo8L3RleHQ+CiAgPHRleHQgeD0iMTI4IiB5PSIxODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJJbnRlciwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiNmZmZmZmYiPlBpZWRyYTwvdGV4dD4KICA8dGV4dCB4PSIxMjgiIHk9IjIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2M3ZjlmZiI+cmVjdXJzbyBpbmNydXN0YWRvPC90ZXh0Pgo8L3N2Zz4=", "papel": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBhcGVsIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwZjE3MmEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjU1IiBzdG9wLWNvbG9yPSIjMTU1ZTc1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzFkNGVkOCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI0NCIgZmlsbD0idXJsKCNnKSIvPgogIDxjaXJjbGUgY3g9IjEyOCIgY3k9IjEwMiIgcj0iNTgiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xNCkiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjMyKSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPHRleHQgeD0iMTI4IiB5PSIxMjMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJTZWdvZSBVSSBFbW9qaSwgQXBwbGUgQ29sb3IgRW1vamksIE5vdG8gQ29sb3IgRW1vamksIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNzgiPuKcizwvdGV4dD4KICA8dGV4dCB4PSIxMjgiIHk9IjE4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9IjgwMCIgZmlsbD0iI2ZmZmZmZiI+UGFwZWw8L3RleHQ+CiAgPHRleHQgeD0iMTI4IiB5PSIyMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJJbnRlciwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNjN2Y5ZmYiPnJlY3Vyc28gaW5jcnVzdGFkbzwvdGV4dD4KPC9zdmc+", "tijera": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlRpamVyYSI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMGYxNzJhIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41NSIgc3RvcC1jb2xvcj0iIzE1NWU3NSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxZDRlZDgiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiByeD0iNDQiIGZpbGw9InVybCgjZykiLz4KICA8Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMDIiIHI9IjU4IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMTQpIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4zMikiIHN0cm9rZS13aWR0aD0iNCIvPgogIDx0ZXh0IHg9IjEyOCIgeT0iMTIzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iU2Vnb2UgVUkgRW1vamksIEFwcGxlIENvbG9yIEVtb2ppLCBOb3RvIENvbG9yIEVtb2ppLCBzYW5zLXNlcmlmIiBmb250LXNpemU9Ijc4Ij7inIzvuI88L3RleHQ+CiAgPHRleHQgeD0iMTI4IiB5PSIxODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJJbnRlciwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiNmZmZmZmYiPlRpamVyYTwvdGV4dD4KICA8dGV4dCB4PSIxMjgiIHk9IjIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2M3ZjlmZiI+cmVjdXJzbyBpbmNydXN0YWRvPC90ZXh0Pgo8L3N2Zz4="};

            const imageSource = (choice) =>
              RPS_IMAGE_SOURCES[choice] || RPS_IMAGE_SOURCES.piedra;

            const winsPlayer = (playerChoice, machineChoice) =>
              (playerChoice === "piedra" && machineChoice === "tijera") ||
              (playerChoice === "papel" && machineChoice === "piedra") ||
              (playerChoice === "tijera" && machineChoice === "papel");

            const animateRound = (...winners) => {
              Object.values(choiceBoxes).forEach((box) => {
                box.classList.remove("is-shaking");
                // Fuerza el reinicio de la animacion cuando el alumno pulsa varias rondas seguidas.
                void box.offsetWidth;
                box.classList.add("is-shaking");
              });

              winners.filter(Boolean).forEach((winner) => {
                scoreBoxes[winner]?.classList.add("is-bump");
                window.setTimeout(
                  () => scoreBoxes[winner]?.classList.remove("is-bump"),
                  220,
                );
              });
            };

            const renderScore = () => {
              scoreViews.jugador.textContent = String(score.jugador);
              scoreViews.maquina.textContent = String(score.maquina);
            };

            const renderChoices = (playerChoice, machineChoice) => {
              choiceViews.jugador.textContent = titleCaseChoice(playerChoice);
              choiceViews.maquina.textContent = titleCaseChoice(machineChoice);
              symbolViews.jugador.dataset.rpsMove = playerChoice;
              symbolViews.maquina.dataset.rpsMove = machineChoice;
              symbolViews.jugador.src = imageSource(playerChoice);
              symbolViews.maquina.src = imageSource(machineChoice);
              symbolViews.jugador.setAttribute(
                "aria-label",
                titleCaseChoice(playerChoice),
              );
              symbolViews.maquina.setAttribute(
                "aria-label",
                titleCaseChoice(machineChoice),
              );
            };

            const checkEndGame = () => {
              const playerWins = score.jugador >= WINNING_SCORE;
              const machineWins = score.maquina >= WINNING_SCORE;
              if (!playerWins && !machineWins) {
                return false;
              }

              gameFinished = true;
              result.classList.add("is-final");
              if (playerWins && machineWins) {
                result.textContent = `Empate final: ${score.jugador} - ${score.maquina}. Pulsa Reiniciar para otra partida.`;
              } else if (playerWins) {
                result.textContent = `Has ganado la partida: ${score.jugador} - ${score.maquina}. Pulsa Reiniciar para otra partida.`;
              } else {
                result.textContent = `Gana la maquina: ${score.jugador} - ${score.maquina}. Pulsa Reiniciar para otra partida.`;
              }
              return true;
            };

            const playRound = (playerChoice) => {
              if (gameFinished) {
                result.textContent =
                  "La partida ya ha terminado. Pulsa Reiniciar para empezar de nuevo.";
                return;
              }

              const machineChoice =
                choices[Math.floor(Math.random() * choices.length)];
              result.classList.remove("is-final");
              renderChoices(playerChoice, machineChoice);

              if (playerChoice === machineChoice) {
                score.jugador += 1;
                score.maquina += 1;
                renderScore();
                animateRound("jugador", "maquina");
                result.textContent =
                  "Empate: se suma un punto al jugador y otro a la maquina.";
                checkEndGame();
                return;
              }

              const winner = winsPlayer(playerChoice, machineChoice)
                ? "jugador"
                : "maquina";
              score[winner] += 1;
              renderScore();
              animateRound(winner);
              result.textContent =
                winner === "jugador"
                  ? `${titleCaseChoice(playerChoice)} gana a ${machineChoice}: punto para el jugador.`
                  : `${titleCaseChoice(machineChoice)} gana a ${playerChoice}: punto para la maquina.`;
              checkEndGame();
            };

            const resetGame = () => {
              score.jugador = 0;
              score.maquina = 0;
              gameFinished = false;
              renderChoices("piedra", "piedra");
              result.classList.remove("is-final");
              result.textContent = "Elige tu jugada";
              renderScore();
            };

            lab.addEventListener("click", (event) => {
              const choiceButton = event.target.closest("[data-rps-choice]");
              const resetButton = event.target.closest("[data-rps-reset]");

              if (choiceButton) {
                playRound(choiceButton.dataset.rpsChoice);
              } else if (resetButton) {
                resetGame();
              }
            });

            renderScore();
            renderChoices("piedra", "piedra");
          });

          document.querySelectorAll('[data-lab="layout"]').forEach((lab) => {
            const stage = lab.querySelector(".layout-stage");
            const feedback = lab.querySelector("[data-feedback]");
            const gapInput = lab.querySelector("[data-gap]");
            const gapOutput = lab.querySelector("[data-gap-output]");
            const centerInput = lab.querySelector("[data-center]");
            const code = lab.querySelector("[data-layout-code]");
            const modeLabel = lab.querySelector("[data-layout-mode-label]");
            const ruleTitle = lab.querySelector("[data-layout-rule-title]");
            const ruleCopy = lab.querySelector("[data-layout-rule-copy]");
            const ruleAxis = lab.querySelector("[data-layout-axis]");
            const ruleUse = lab.querySelector("[data-layout-use]");
            const ruleRisk = lab.querySelector("[data-layout-risk]");
            const messages = {
              block:
                "Block apila cada caja en una linea nueva: es el comportamiento base de muchos elementos.",
              flex: "Flex reparte las cajas en una fila flexible y permite alinearlas como una barra de herramientas.",
              grid: "Grid crea una cuadricula: cada pieza ocupa una celda y el conjunto gana estructura.",
            };
            const ruleDetails = {
              block: {
                label: "display: block",
                title: "Block: flujo vertical",
                copy: "Cada elemento reclama su propia linea. Es el punto de partida de muchos elementos HTML.",
                axis: "Arriba hacia abajo",
                use: "Contenido normal: titulos, parrafos y secciones.",
                risk: "Intentar crear una barra o cuadricula solo con block.",
              },
              flex: {
                label: "display: flex",
                title: "Flex: un eje flexible",
                copy: "Las piezas se colocan en una direccion principal y pueden saltar de linea si no caben.",
                axis: "Fila o columna",
                use: "Menus, barras, tarjetas en fila y alineacion de piezas.",
                risk: "Usarlo para estructuras de filas y columnas demasiado rigidas.",
              },
              grid: {
                label: "display: grid",
                title: "Grid: filas y columnas",
                copy: "El contenedor crea una cuadricula y cada pieza entra en una celda.",
                axis: "Dos ejes",
                use: "Galerias, paneles, dashboards y layouts con filas y columnas.",
                risk: "Usarlo para una alineacion simple que Flex resolveria mejor.",
              },
            };
            const codeSamples = {
              block: `.caja {
    width: 120px;
    height: 80px;
    margin: 10px;
    padding: 10px;
    color: white;
    text-align: center;
    display: block;
}

img {
    width: 120px;
    height: 120px;
    display: block;
}`,
              flex: `.padre {
    display: flex; /*los hijos se ven de manera flexible*/
    background-color: darksalmon;
    width: 100vw;
    height: 100vh;
    gap: 60px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
}

.hijo {
    background-color: rgb(103, 103, 206);
    padding: 20px;
    color: #ffffff;
    border-radius: 8px;
}`,
              grid: `.padre {
    display: grid; /*los hijos se ven en filas y columnas*/
    background-color: darksalmon;
    width: 100vw;
    height: 100vh;
    gap: 60px;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 1fr 2fr 1fr;
    justify-items: center;
    align-items: center;
}

.hijo {
    background-color: rgb(103, 103, 206);
    padding: 20px;
    color: #ffffff;
    border-radius: 8px;
}`,
            };

            const setMode = (mode) => {
              stage.dataset.mode = mode;
              lab.querySelectorAll("[data-mode]").forEach((button) => {
                const active = button.dataset.mode === mode;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", active ? "true" : "false");
              });
              feedback.textContent = messages[mode];
              const details = ruleDetails[mode] || ruleDetails.block;
              if (modeLabel) modeLabel.textContent = details.label;
              if (ruleTitle) ruleTitle.textContent = details.title;
              if (ruleCopy) ruleCopy.textContent = details.copy;
              if (ruleAxis) ruleAxis.textContent = details.axis;
              if (ruleUse) ruleUse.textContent = details.use;
              if (ruleRisk) ruleRisk.textContent = details.risk;
              if (code) {
                // El codigo mostrado cambia con cada modo; se recolorea despues de sustituir el texto.
                code.textContent = codeSamples[mode] || codeSamples.block;
                highlightCodeElement(code);
              }
            };
            setMode(stage.dataset.mode || "block");

            lab.addEventListener("click", (event) => {
              const button = event.target.closest("[data-mode]");
              if (button) {
                setMode(button.dataset.mode);
              }
            });

            gapInput?.addEventListener("input", () => {
              stage.style.setProperty("--lab-gap", `${gapInput.value}px`);
              gapOutput.textContent = `${gapInput.value} px`;
            });

            centerInput?.addEventListener("change", () => {
              stage.dataset.center = centerInput.checked ? "true" : "false";
            });
          });

          document.querySelectorAll('[data-lab="display"]').forEach((lab) => {
            const stage = lab.querySelector(".display-stage");
            const feedback = lab.querySelector("[data-feedback]");
            const messages = {
              block:
                "Block fuerza una columna: cada pieza reclama una fila completa aunque su texto sea corto.",
              inline:
                "Inline coloca las piezas dentro de la frase visual: no respeta ancho ni alto propios.",
              "inline-block":
                "Inline-block mantiene las piezas en linea, pero cada una conserva su caja medible.",
            };

            lab.addEventListener("click", (event) => {
              const button = event.target.closest("[data-display-mode]");
              if (!button) {
                return;
              }
              const mode = button.dataset.displayMode;
              stage.dataset.displayState = mode;
              lab.querySelectorAll("[data-display-mode]").forEach((control) => {
                const active = control === button;
                control.classList.toggle("is-active", active);
                control.setAttribute("aria-pressed", active ? "true" : "false");
              });
              feedback.textContent = messages[mode];
            });
          });

          document.querySelectorAll('[data-lab="dom"]').forEach((lab) => {
            const target = lab.querySelector("[data-dom-target]");
            const counter = lab.querySelector("[data-dom-counter]");
            const eventText = lab.querySelector("[data-dom-event]");
            const commandText = lab.querySelector("[data-dom-command]");
            const resultText = lab.querySelector("[data-dom-result]");
            const codeLine = lab.querySelector("[data-dom-code]");
            const nodeText = lab.querySelector("[data-dom-node-text]");
            const propertyText = lab.querySelector("[data-dom-property]");
            const feedback = lab.querySelector("[data-feedback]");
            const colors = ["#2454d6", "#087d7c", "#c77b19", "#bd3e57"];
            let clicks = 0;
            let colorIndex = 0;

            lab.addEventListener("click", (event) => {
              const button = event.target.closest("[data-dom-action]");
              if (!button) {
                return;
              }
              clicks += 1;
              counter.textContent = String(clicks);

              if (button.dataset.domAction === "text") {
                target.textContent = "El DOM acaba de cambiar este texto.";
                nodeText.textContent = "El DOM acaba de cambiar este texto.";
                propertyText.textContent = "mensaje.textContent";
                eventText.textContent = "clic en Cambiar texto";
                commandText.textContent = "textContent escribe un contenido nuevo";
                resultText.textContent = "la frase visible se sustituye";
                codeLine.textContent =
                  'const mensaje = document.querySelector("#mensaje");\nmensaje.textContent = "El DOM acaba de cambiar este texto.";';
                feedback.textContent =
                  "Primero ocurre el clic, despues JavaScript entra en la funcion y por ultimo cambia el texto del nodo.";
              } else if (button.dataset.domAction === "color") {
                const nextColor = colors[colorIndex % colors.length];
                target.style.color = nextColor;
                propertyText.textContent = `mensaje.style.color = "${nextColor}"`;
                colorIndex += 1;
                eventText.textContent = "clic en Cambiar color";
                commandText.textContent = "style.color cambia solo la presentacion";
                resultText.textContent = "el mismo nodo conserva el texto, pero cambia de color";
                codeLine.textContent = `const mensaje = document.querySelector("#mensaje");\nmensaje.style.color = "${nextColor}";`;
                feedback.textContent =
                  "Aqui no se cambia el HTML ni el texto: se modifica una propiedad CSS desde JavaScript.";
              } else {
                clicks = 0;
                colorIndex = 0;
                counter.textContent = "0";
                target.textContent = "Estoy esperando una orden del DOM.";
                target.style.color = "";
                nodeText.textContent = "Estoy esperando una orden del DOM.";
                propertyText.textContent = "mensaje.textContent";
                eventText.textContent = "clic en Reiniciar";
                commandText.textContent = "se restauran texto, color y contador";
                resultText.textContent = "la cabina vuelve al estado inicial";
                codeLine.textContent =
                  'const mensaje = document.querySelector("#mensaje");\nmensaje.textContent = "nuevo valor";';
                feedback.textContent =
                  "El reinicio deja claro que JavaScript puede escribir valores nuevos o recuperar los iniciales.";
              }
            });
          });

          document.querySelectorAll('[data-lab="dni"]').forEach((lab) => {
            const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
            const input = lab.querySelector("[data-dni-input]");
            const result = lab.querySelector("[data-dni-result]");
            const feedback = lab.querySelector("[data-feedback]");
            const calculate = () => {
              const digits = input.value.replace(/\D/g, "").slice(0, 8);
              input.value = digits;
              if (digits.length !== 8) {
                result.textContent = "Faltan cifras";
                feedback.textContent =
                  "El calculo necesita exactamente ocho cifras.";
                return;
              }
              const rest = Number(digits) % 23;
              const letter = letters[rest];
              result.textContent = `${digits}${letter}`;
              feedback.textContent = `${digits} % 23 = ${rest}, por eso se selecciona la posicion ${rest}: ${letter}.`;
            };

            lab
              .querySelector("[data-dni-action]")
              ?.addEventListener("click", calculate);
            input?.addEventListener("input", calculate);
            calculate();
          });

          document.querySelectorAll('[data-lab="form-game"]').forEach((lab) => {
            const formScreen = lab.querySelector("[data-fg-form-screen]");
            const boardScreen = lab.querySelector("[data-fg-board-screen]");
            const nameInput = lab.querySelector("[data-fg-name]");
            const passwordInput = lab.querySelector("[data-fg-password]");
            const birthInput = lab.querySelector("[data-fg-birth]");
            const termsInput = lab.querySelector("[data-fg-terms]");
            const status = lab.querySelector("[data-fg-status]");
            const boardStatus = lab.querySelector("[data-fg-board-status]");
            const cubes = Array.from(lab.querySelectorAll("[data-color]"));

            const calculateAge = (dateValue) => {
              if (!dateValue) {
                return 0;
              }
              const birthDate = new Date(`${dateValue}T00:00:00`);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age -= 1;
              }
              return Number.isFinite(age) ? age : 0;
            };

            const isStrongPassword = (value) =>
              value.length >= 8 &&
              /[A-Z]/.test(value) &&
              /[a-z]/.test(value) &&
              /\d/.test(value) &&
              /[^A-Za-z0-9]/.test(value);

            const validationState = () => ({
              name: nameInput.value.trim().length >= 2,
              password: isStrongPassword(passwordInput.value),
              age: calculateAge(birthInput.value) >= 18,
              terms: termsInput.checked,
            });

            const renderValidation = () => {
              const state = validationState();
              Object.entries(state).forEach(([key, valid]) => {
                lab
                  .querySelector(`[data-fg-check="${key}"]`)
                  ?.classList.toggle("is-ok", valid);
              });
              const readyToSend = Object.values(state).every(Boolean);
              const age = calculateAge(birthInput.value);
              status.textContent = readyToSend
                ? `Formulario listo: edad calculada ${age} anos.`
                : `Faltan requisitos: edad calculada ${age || 0} anos.`;
              return readyToSend;
            };

            const showBoard = () => {
              formScreen.hidden = true;
              boardScreen.hidden = false;
              boardStatus.textContent = "Toca un cubo para pasarlo a negro.";
            };

            const showForm = () => {
              formScreen.hidden = false;
              boardScreen.hidden = true;
            };

            const resetCubes = () => {
              cubes.forEach((cube) => cube.classList.remove("is-off"));
              boardStatus.textContent = "Toca un cubo para pasarlo a negro.";
            };

            lab
              .querySelector("[data-fg-toggle-password]")
              ?.addEventListener("click", (event) => {
                const visible = passwordInput.type === "text";
                passwordInput.type = visible ? "password" : "text";
                event.currentTarget.textContent = visible ? "Ver" : "Ocultar";
              });

            lab
              .querySelector("[data-fg-submit]")
              ?.addEventListener("click", () => {
                if (renderValidation()) {
                  resetCubes();
                  showBoard();
                } else {
                  status.textContent =
                    "No pasa al tablero: revisa los indicadores.";
                }
              });

            lab
              .querySelector("[data-fg-fill-valid]")
              ?.addEventListener("click", () => {
                nameInput.value = "Nora";
                passwordInput.value = "Web2026!";
                birthInput.value = "2004-01-15";
                termsInput.checked = true;
                showForm();
                renderValidation();
              });

            lab
              .querySelector("[data-fg-fill-invalid]")
              ?.addEventListener("click", () => {
                nameInput.value = "A";
                passwordInput.value = "clave";
                birthInput.value = "2012-05-30";
                termsInput.checked = false;
                showForm();
                renderValidation();
              });

            lab
              .querySelector("[data-fg-restart]")
              ?.addEventListener("click", () => {
                resetCubes();
                showForm();
                renderValidation();
              });

            lab
              .querySelector("[data-fg-board]")
              ?.addEventListener("click", (event) => {
                const cube = event.target.closest("[data-color]");
                if (!cube) {
                  return;
                }
                cube.classList.add("is-off");
                const offCount = cubes.filter((item) =>
                  item.classList.contains("is-off"),
                ).length;
                boardStatus.textContent =
                  offCount === cubes.length
                    ? "Fin de juego: todos los cubos estan negros."
                    : `${offCount}/${cubes.length} cubos apagados.`;
              });

            [nameInput, passwordInput, birthInput, termsInput].forEach(
              (control) => {
                control?.addEventListener("input", renderValidation);
                control?.addEventListener("change", renderValidation);
              },
            );

            renderValidation();
          });

          document.querySelectorAll('[data-lab="guess-storage"]').forEach((lab) => {
            const NUMERO_MINIMO = 1;
            const NUMERO_MAXIMO = 100;
            const INTENTOS_MAXIMOS = 5;
            const CLAVE_NUMERO_SECRETO = "ADIVINA_NUMERO_SECRETO";
            const CLAVE_INTENTOS_RESTANTES = "ADIVINA_INTENTOS_RESTANTES";
            const CLAVE_HISTORIAL_INTENTOS = "ADIVINA_HISTORIAL_INTENTOS";
            const input = lab.querySelector("[data-guess-input]");
            const counterOutput = lab.querySelector("[data-guess-counter]");
            const feedback = lab.querySelector("[data-guess-feedback]");
            const historyOutput = lab.querySelector("[data-guess-history]");
            const storageRows = {
              secret: lab.querySelector('[data-guess-storage-row="secret"]'),
              remaining: lab.querySelector('[data-guess-storage-row="remaining"]'),
              history: lab.querySelector('[data-guess-storage-row="history"]'),
            };
            const storageValues = {
              secret: lab.querySelector('[data-guess-storage-value="secret"]'),
              remaining: lab.querySelector('[data-guess-storage-value="remaining"]'),
              history: lab.querySelector('[data-guess-storage-value="history"]'),
            };
            let numeroSecreto = null;
            let intentosUsados = 0;
            let historial = [];
            let sesionActiva = false;
            let partidaTerminada = false;

            // Comprueba una vez que el navegador permite usar localStorage.
            const storageDisponible = (() => {
              try {
                const clavePrueba = "DIARIO_CURSOWEBM_STORAGE_TEST";
                localStorage.setItem(clavePrueba, "ok");
                localStorage.removeItem(clavePrueba);
                return true;
              } catch {
                return false;
              }
            })();

            // Lee una clave real del ejercicio sin romper si el navegador la bloquea.
            const leerMemoria = (clave) =>
              storageDisponible ? localStorage.getItem(clave) : null;

            // Escribe una clave real del ejercicio solo cuando localStorage esta disponible.
            const escribirMemoria = (clave, valor) => {
              if (storageDisponible) {
                localStorage.setItem(clave, valor);
              }
            };

            // Borra una clave real del ejercicio manteniendo el laboratorio aislado.
            const borrarMemoria = (clave) => {
              if (storageDisponible) {
                localStorage.removeItem(clave);
              }
            };

            // Genera el mismo rango de numero secreto que el ejercicio del alumno.
            const generarNumeroSecreto = () =>
              Math.floor(Math.random() * (NUMERO_MAXIMO - NUMERO_MINIMO + 1)) +
              NUMERO_MINIMO;

            // Mantiene el contador dentro de los limites visibles del laboratorio.
            const intentosRestantes = () =>
              Math.max(INTENTOS_MAXIMOS - intentosUsados, 0);

            // Pinta una fila de localStorage y marca visualmente si esta vacia.
            const pintarValorGuardado = (nombre, valor) => {
              const estaVacio = valor === null || valor === "";
              storageRows[nombre]?.classList.toggle("is-empty", estaVacio);
              if (storageValues[nombre]) {
                storageValues[nombre].textContent = estaVacio ? "" : valor;
              }
            };

            // Refresca el panel que representa lo que queda guardado entre sesiones.
            const pintarMemoria = () => {
              pintarValorGuardado(
                "secret",
                leerMemoria(CLAVE_NUMERO_SECRETO),
              );
              pintarValorGuardado(
                "remaining",
                leerMemoria(CLAVE_INTENTOS_RESTANTES),
              );
              pintarValorGuardado(
                "history",
                leerMemoria(CLAVE_HISTORIAL_INTENTOS),
              );
            };

            // Refresca las variables activas y el historial visible de la partida.
            const pintarEstado = () => {
              const tieneSesion = sesionActiva && numeroSecreto !== null;
              if (counterOutput) {
                counterOutput.textContent = tieneSesion
                  ? `Intentos restantes: ${intentosRestantes()}`
                  : "";
              }
              historyOutput.textContent = historial.length
                ? historial.join("\n")
                : "";
              if (input) {
                input.disabled = !tieneSesion || partidaTerminada;
              }
              pintarMemoria();
            };

            // Guarda la partida incompleta con las mismas claves que usa el alumno.
            const guardarPartida = () => {
              if (!sesionActiva || partidaTerminada) {
                pintarMemoria();
                return;
              }
              escribirMemoria(CLAVE_NUMERO_SECRETO, String(numeroSecreto));
              escribirMemoria(
                CLAVE_INTENTOS_RESTANTES,
                String(intentosRestantes()),
              );
              escribirMemoria(
                CLAVE_HISTORIAL_INTENTOS,
                historial.join("\n"),
              );
              pintarMemoria();
            };

            // Borra solo las claves que indican que existe una partida pendiente.
            const borrarPartidaPendiente = () => {
              borrarMemoria(CLAVE_NUMERO_SECRETO);
              borrarMemoria(CLAVE_INTENTOS_RESTANTES);
            };

            // Borra todo el estado persistente del juego, incluido el historial.
            const borrarTodo = () => {
              borrarPartidaPendiente();
              borrarMemoria(CLAVE_HISTORIAL_INTENTOS);
            };

            // Empieza una partida y la deja guardada para que se vea la persistencia.
            const crearPartida = (mensaje = "") => {
              numeroSecreto = generarNumeroSecreto();
              intentosUsados = 0;
              historial = [];
              sesionActiva = true;
              partidaTerminada = false;
              guardarPartida();
              feedback.textContent = mensaje;
              pintarEstado();
            };

            // Recupera una partida pendiente usando las claves guardadas en el navegador.
            const cargarSesion = (mensaje) => {
              const numeroGuardadoTexto = leerMemoria(CLAVE_NUMERO_SECRETO);
              const restantesGuardadosTexto = leerMemoria(
                CLAVE_INTENTOS_RESTANTES,
              );
              const numeroGuardado = Number(numeroGuardadoTexto);
              const restantesGuardados = Number(restantesGuardadosTexto);
              const historialGuardado = leerMemoria(CLAVE_HISTORIAL_INTENTOS);
              const datosValidos =
                numeroGuardadoTexto !== null &&
                restantesGuardadosTexto !== null &&
                Number.isInteger(numeroGuardado) &&
                numeroGuardado >= NUMERO_MINIMO &&
                numeroGuardado <= NUMERO_MAXIMO &&
                Number.isInteger(restantesGuardados) &&
                restantesGuardados >= 0 &&
                restantesGuardados <= INTENTOS_MAXIMOS;

              if (!datosValidos) {
                feedback.textContent =
                  "No hay una partida pendiente valida para cargar.";
                pintarEstado();
                return false;
              }

              numeroSecreto = numeroGuardado;
              intentosUsados = INTENTOS_MAXIMOS - restantesGuardados;
              historial = historialGuardado ? historialGuardado.split("\n") : [];
              sesionActiva = true;
              partidaTerminada = false;
              feedback.textContent = mensaje;
              pintarEstado();
              return true;
            };

            // Procesa un intento y actualiza tanto la partida como localStorage.
            const comprobarIntento = () => {
              if (!sesionActiva || numeroSecreto === null) {
                feedback.textContent =
                  "Primero crea una partida o carga una sesion guardada.";
                return;
              }

              const intento = Number(input.value);
              if (
                !Number.isInteger(intento) ||
                intento < NUMERO_MINIMO ||
                intento > NUMERO_MAXIMO
              ) {
                feedback.textContent =
                  "Introduce un numero entero entre 1 y 100.";
                return;
              }

              intentosUsados += 1;
              if (intento === numeroSecreto) {
                historial.push(`Intento ${intentosUsados}: ${intento} -> correcto`);
                partidaTerminada = true;
                borrarPartidaPendiente();
                escribirMemoria(CLAVE_HISTORIAL_INTENTOS, historial.join("\n"));
                feedback.textContent =
                  "Correcto: la partida termina y ya no queda partida pendiente.";
                pintarEstado();
                return;
              }

              if (intentosUsados >= INTENTOS_MAXIMOS) {
                historial.push(
                  `Intento ${intentosUsados}: ${intento} -> derrota; era ${numeroSecreto}`,
                );
                partidaTerminada = true;
                borrarPartidaPendiente();
                escribirMemoria(CLAVE_HISTORIAL_INTENTOS, historial.join("\n"));
                feedback.textContent =
                  "Sin intentos: se borra la partida pendiente y queda el historial.";
                pintarEstado();
                return;
              }

              const pista = intento > numeroSecreto ? "menor" : "mayor";
              historial.push(
                `Intento ${intentosUsados}: el numero secreto es ${pista} que ${intento}`,
              );
              feedback.textContent = `Pista: el numero secreto es ${pista} que ${intento}.`;
              guardarPartida();
              pintarEstado();
              input.select();
            };

            lab.addEventListener("click", (event) => {
              const action = event.target.closest("[data-guess-action]")?.dataset
                .guessAction;
              if (action === "try") {
                comprobarIntento();
              } else if (action === "restart") {
                borrarTodo();
                crearPartida();
                input?.focus();
              }
            });

            input?.addEventListener("keydown", (event) => {
              if (event.key === "Enter") {
                comprobarIntento();
              }
            });

            if (!storageDisponible) {
              feedback.textContent =
                "Este navegador no permite localStorage en este contexto.";
              pintarEstado();
            } else if (
              leerMemoria(CLAVE_NUMERO_SECRETO) !== null &&
              leerMemoria(CLAVE_INTENTOS_RESTANTES) !== null
            ) {
              cargarSesion("");
            } else {
              crearPartida();
            }
          });

          document.querySelectorAll('[data-lab="array"]').forEach((lab) => {
            const originalRows = [
              { name: "Ana", age: 22 },
              { name: "Leo", age: 19 },
              { name: "Nora", age: 25 },
              { name: "Izan", age: 21 },
            ];
            let rows = [...originalRows];
            const body = lab.querySelector("[data-array-body]");
            const stats = lab.querySelector("[data-array-stats]");
            const code = lab.querySelector("[data-array-code]");
            const paintRowsSample = () => `function addUnAlumno(alumno)
{
    let bodytabla = document.getElementById('bodytabla');
    let filanueva = document.createElement('tr');
    let columnaNombre = document.createElement('td');
    let columnaEdad = document.createElement('td');
    let columnaCurso = document.createElement('td');
    let columnaEmail = document.createElement('td');

    columnaNombre.textContent = alumno.nombre;
    columnaEdad.textContent = alumno.edad;
    columnaCurso.textContent = alumno.curso;
    columnaEmail.textContent = alumno.email;

    filanueva.appendChild(columnaNombre);
    filanueva.appendChild(columnaEdad);
    filanueva.appendChild(columnaCurso);
    filanueva.appendChild(columnaEmail);
    bodytabla.appendChild(filanueva);
}

function addAlumnos ()
{
    alumnos.forEach(
        (alumno) => {
            addUnAlumno(alumno);
        }
    );
}`;
            const codeSamples = {
              render: paintRowsSample(),
              sort: `function borrarTodos()
{
    let bodytabla = document.getElementById('bodytabla');
    bodytabla.innerHTML = "";
}

function addUnAlumno(alumno)
{
    let bodytabla = document.getElementById('bodytabla');
    let filanueva = document.createElement('tr');
    let columnaNombre = document.createElement('td');
    let columnaEdad = document.createElement('td');
    let columnaCurso = document.createElement('td');
    let columnaEmail = document.createElement('td');

    columnaNombre.textContent = alumno.nombre;
    columnaEdad.textContent = alumno.edad;
    columnaCurso.textContent = alumno.curso;
    columnaEmail.textContent = alumno.email;

    filanueva.appendChild(columnaNombre);
    filanueva.appendChild(columnaEdad);
    filanueva.appendChild(columnaCurso);
    filanueva.appendChild(columnaEmail);
    bodytabla.appendChild(filanueva);
}

function addAlumnos ()
{
    alumnos.forEach(
        (alumno) => {
            addUnAlumno(alumno);
        }
    );
}

function ordenarPorEdad()
{
    alumnos.sort(
        (alumno1, alumno2) => alumno1.edad - alumno2.edad
    );

    borrarTodos();
    addAlumnos();
}`,
              stats: `function calcularMediaEdad () {
    let media = 0;
    let suma = 0;

    for (let n = 0; n < alumnos.length; n++) {
        suma = suma + alumnos[n].edad;
    }

    media = suma / alumnos.length;
    return media;
}

function calcularMayorEdad() {
    let mayor = 0;

    for (let nalumno = 0; nalumno < alumnos.length; nalumno++) {
        if (alumnos[nalumno].edad > mayor) {
            mayor = alumnos[nalumno].edad;
        }
    }

    return mayor;
}

function calcularMenorEdad() {
    let menor = alumnos[0].edad;

    for (let nalumno = 1; nalumno < alumnos.length; nalumno++) {
        if (alumnos[nalumno].edad < menor) {
            menor = alumnos[nalumno].edad;
        }
    }

    return menor;
}

function mostrarEstadisticas(media, mayorEdad, menorEdad)
{
    let divstats = document.getElementById('stats');
    divstats.textContent = "La media de edad es " + media +
        " la mayor edad es " + mayorEdad +
        " y la menor edad es " + menorEdad;
}

function estadisticasEdad()
{
    let media = calcularMediaEdad();
    let mayorEdad = calcularMayorEdad();
    let menorEdad = calcularMenorEdad();

    mostrarEstadisticas(media, mayorEdad, menorEdad);
}`,
            };

            const setArrayCode = (action) => {
              if (code) {
                // Array Studio muestra codigo distinto por boton, asi que no basta el coloreado inicial.
                code.textContent = codeSamples[action] || codeSamples.render;
                highlightCodeElement(code);
              }
              lab.querySelectorAll("[data-array-action]").forEach((control) => {
                const active = control.dataset.arrayAction === action;
                control.classList.toggle("is-active", active);
                control.setAttribute("aria-pressed", active ? "true" : "false");
              });
            };
            setArrayCode("render");

            const render = () => {
              body.innerHTML = rows
                .map(
                  (row, index) =>
                    `<tr><td>${index}</td><td>${row.name}</td><td>${row.age}</td></tr>`,
                )
                .join("");
            };

            const summarize = () => {
              const ages = rows.map((row) => row.age);
              const total = ages.reduce((sum, age) => sum + age, 0);
              const average = (total / ages.length).toFixed(1);
              stats.textContent = `Media ${average} anos | menor ${Math.min(...ages)} | mayor ${Math.max(...ages)}`;
            };

            lab.addEventListener("click", (event) => {
              const button = event.target.closest("[data-array-action]");
              if (!button) {
                return;
              }
              if (button.dataset.arrayAction === "render") {
                rows = [...originalRows];
                render();
                setArrayCode("render");
                stats.textContent =
                  "forEach puede pintar cada fila sin perder el indice.";
              } else if (button.dataset.arrayAction === "sort") {
                rows = [...rows].sort((a, b) => a.age - b.age);
                render();
                setArrayCode("sort");
                stats.textContent =
                  "sort reordena una copia por edad ascendente.";
              } else {
                render();
                setArrayCode("stats");
                summarize();
              }
            });
          });

          document.querySelectorAll('[data-lab="quicksort"]').forEach((lab) => {
            const quickVisual = lab.querySelector("[data-quicksort-visual]");
            const quickTitle = lab.querySelector("[data-quicksort-title]");
            const quickExplain = lab.querySelector("[data-quicksort-explain]");
            const quickTrace = lab.querySelector("[data-quicksort-trace]");
            const quickValues = [5, 9, 1, 6, 2, 3];
            const quickSteps = [];
            let quickNodeId = 0;
            let quickIndex = 0;

            const describeList = (values) =>
              values.length ? `[${values.join(", ")}]` : "[]";

            const buildQuickTree = (
              values,
              depth = 0,
              branchLabel = "inicio",
              parentId = null,
            ) => {
              // El arbol conserva la particion completa para poder dibujar cada paso sin recalcularlo.
              const node = {
                id: quickNodeId,
                depth,
                branchLabel,
                values,
                parentId,
                pivot: values.length > 1 ? values[0] : null,
                leftValues: [],
                rightValues: [],
                left: null,
                right: null,
                result: [...values],
              };
              quickNodeId += 1;

              if (values.length <= 1) {
                return node;
              }

              const rest = values.slice(1);
              node.leftValues = rest.filter((value) => value <= node.pivot);
              node.rightValues = rest.filter((value) => value > node.pivot);
              node.left = buildQuickTree(
                node.leftValues,
                depth + 1,
                `menores que ${node.pivot}`,
                node.id,
              );
              node.right = buildQuickTree(
                node.rightValues,
                depth + 1,
                `mayores que ${node.pivot}`,
                node.id,
              );
              node.result = [
                ...node.left.result,
                node.pivot,
                ...node.right.result,
              ];
              return node;
            };

            const addQuickSteps = (node) => {
              if (node.values.length <= 1) {
                quickSteps.push({
                  node,
                  phase: "base",
                  title: `Caso base ${describeList(node.values)}`,
                  explain: "Una lista con cero o un elemento ya esta colocada.",
                });
                return;
              }

              quickSteps.push({
                node,
                phase: "scan",
                title: `Elegir pivote ${node.pivot}`,
                explain:
                  "Se mira la fila y se marca el pivote. Aun no se mueve nada.",
              });
              quickSteps.push({
                node,
                phase: "route",
                title: `Decidir destinos de ${describeList(node.values)}`,
                explain:
                  "Las flechas muestran a que rama ira cada cuadrito en el siguiente paso.",
              });
              quickSteps.push({
                node,
                phase: "move",
                title: `Separar por el pivote ${node.pivot}`,
                explain: `Menores ${describeList(node.leftValues)}, pivote [${node.pivot}], mayores ${describeList(node.rightValues)}.`,
              });
              addQuickSteps(node.left);
              addQuickSteps(node.right);
              quickSteps.push({
                node,
                phase: "merge",
                title: `Recomponer ${describeList(node.result)}`,
                explain: "Las ramas ya ordenadas bajan a la fila final.",
              });
            };

            const classForQuickValue = (step, value) => {
              if (step.phase === "merge") {
                return "is-merged";
              }
              if (step.phase === "base") {
                return "is-base";
              }
              if (step.phase === "scan") {
                return step.node.pivot === value ? "is-pivot" : "is-still";
              }
              if (!["route", "move"].includes(step.phase)) {
                return "is-still";
              }
              const node = step.node;
              if (node.pivot === value) {
                return "is-pivot";
              }
              if (node.leftValues?.includes(value)) {
                return "is-left";
              }
              if (node.rightValues?.includes(value)) {
                return "is-right";
              }
              return "is-still";
            };

            const destinationForQuickValue = (step, value) => {
              const node = step.node;
              if (node.pivot === value) {
                return "pivote";
              }
              if (node.leftValues?.includes(value)) {
                return "↙";
              }
              if (node.rightValues?.includes(value)) {
                return "↘";
              }
              return "";
            };

            const cardMarkup = (value, className = "is-still", note = "") =>
              `<span class="quick-card ${className}"><strong>${value}</strong>${note ? `<small>${note}</small>` : ""}</span>`;

            const groupMarkup = (values, step, options = {}) => {
              const cards = values
                .map((value) => {
                  const note = options.route
                    ? destinationForQuickValue(step, value)
                    : options.markPivot && value === step.node.pivot
                      ? "pivote"
                      : options.note || "";
                  return cardMarkup(
                    value,
                    classForQuickValue(step, value),
                    note,
                  );
                })
                .join("");
              return `<div class="quick-card-row">${cards || '<span class="quick-empty">vacio</span>'}</div>`;
            };

            const nodePhaseFor = (node, currentStep) => {
              // Un nodo ya recombinado queda marcado aunque el foco del paso este en otra rama.
              const index = quickSteps.findIndex(
                (step) =>
                  step.node.id === node.id && step.phase === currentStep.phase,
              );
              if (node.id !== currentStep.node.id) {
                const mergeIndex = quickSteps.findIndex(
                  (step) => step.node.id === node.id && step.phase === "merge",
                );
                return mergeIndex >= 0 && mergeIndex < quickIndex
                  ? "merge"
                  : "settled";
              }
              return index === quickIndex ? currentStep.phase : "settled";
            };

            const shouldShowChildren = (node) =>
              // Los hijos aparecen solo cuando el paso ya ha explicado su movimiento.
              quickSteps.findIndex(
                (step) =>
                  step.node.id === node.id &&
                  ["move", "merge"].includes(step.phase),
              ) <= quickIndex;

            const treeMarkup = (node, currentStep) => {
              const phase = nodePhaseFor(node, currentStep);
              const active =
                node.id === currentStep.node.id ? "is-active-node" : "";
              const route =
                node.id === currentStep.node.id &&
                currentStep.phase === "route";
              const childrenVisible =
                node.values.length > 1 && shouldShowChildren(node);
              const group = groupMarkup(
                node.values,
                { ...currentStep, node, phase },
                {
                  route,
                  markPivot: phase === "scan" && node.pivot,
                },
              );
              const children = childrenVisible
                ? `<div class="quick-tree-children">
          <div class="quick-tree-child is-left-branch">
            <span class="quick-arrow">↙</span>
            ${treeMarkup(node.left, currentStep)}
          </div>
          <div class="quick-tree-child is-pivot-branch">
            <span class="quick-arrow">↓</span>
            ${cardMarkup(node.pivot, "is-pivot", phase === "merge" ? "baja" : "pivote")}
          </div>
          <div class="quick-tree-child is-right-branch">
            <span class="quick-arrow">↘</span>
            ${treeMarkup(node.right, currentStep)}
          </div>
        </div>`
                : "";
              return `<div class="quick-tree-node ${active} is-${phase}" data-depth="${node.depth}">
          <div class="quick-node-label">${node.branchLabel}</div>
          ${group}
          ${route ? '<div class="quick-route-note">Destino marcado: aun no se han movido las tarjetas.</div>' : ""}
          ${children}
        </div>`;
            };

            const renderQuickVisual = (step) => {
              // La fila final se enseña solo cuando termina la recombinacion de la raiz.
              const finalVisible =
                step.phase === "merge" && step.node.id === quickRoot.id;
              return `<div class="quick-board is-${step.phase}">
          <div class="quick-tree">
            ${treeMarkup(quickRoot, step)}
          </div>
          <div class="quick-final-row ${finalVisible ? "is-visible" : ""}">
            <span class="quick-row-label">Fila final</span>
            <div class="quick-card-row">${quickRoot.result.map((value) => cardMarkup(value, finalVisible ? "is-merged" : "is-still", finalVisible ? "ordenado" : "")).join("")}</div>
          </div>
        </div>`;
            };

            const renderQuickStep = () => {
              const step = quickSteps[quickIndex];
              quickTitle.textContent = `Paso ${quickIndex + 1}/${quickSteps.length}: ${step.title}`;
              quickExplain.textContent = step.explain;
              quickVisual.innerHTML = renderQuickVisual(step);
              quickTrace.innerHTML = quickSteps
                .map(
                  (traceStep, index) =>
                    `<li class="${index === quickIndex ? "is-active" : ""}">${index + 1}. ${traceStep.title}</li>`,
                )
                .join("");
            };

            const quickRoot = buildQuickTree(quickValues);
            addQuickSteps(quickRoot);
            renderQuickStep();

            lab.addEventListener("click", (event) => {
              const quickButton = event.target.closest("[data-quick-action]");
              if (!quickButton) {
                return;
              }
              if (quickButton.dataset.quickAction === "next") {
                quickIndex = Math.min(quickIndex + 1, quickSteps.length - 1);
              } else if (quickButton.dataset.quickAction === "prev") {
                quickIndex = Math.max(quickIndex - 1, 0);
              } else {
                quickIndex = 0;
              }
              renderQuickStep();
            });
          });
        });
      })();
