import Image20Regular from "~icons/fluent/image-20-regular";
import Send20Filled from "~icons/fluent/send-20-filled";
import { AppIcon } from "../../../shared/ui/app-icon";
import { Button } from "../../../shared/ui/button";
import { Surface } from "../../../shared/ui/surface";
import { TextArea } from "../../../shared/ui/text-area";

export function ComposeStrip() {
  return (
    <section>
      <Surface class="flex flex-col gap-4" variant="quiet">
        <label class="sr-only" for="compose-entry">
          Share your thoughts
        </label>
        <TextArea
          id="compose-entry"
          class="-m-1 grow-1 border-transparent bg-transparent px-2 py-1 shadow-none hover:border-transparent"
          placeholder="Share your thoughts"
          rows={3}
        />
        <div class="flex items-center justify-between gap-3">
          <div>
            <Button aria-label="Add image" size="icon" variant="ghost">
              <AppIcon icon={Image20Regular} size="lg" />
            </Button>
          </div>
          <Button aria-label="Publish">
            <AppIcon icon={Send20Filled} size="sm" />
          </Button>
        </div>
      </Surface>
    </section>
  );
}
