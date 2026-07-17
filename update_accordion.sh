#!/bin/bash
sed -i '68,94c\
      <div \
        className={cn(\
          "grid transition-all duration-300 ease-in-out",\
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"\
        )}\
      >\
        <div className="overflow-hidden">\
          <div className="p-4 pt-0 flex flex-col gap-3">\
            {country.places.map(place => (\
              <PlaceCard \
                key={place.id} \
                place={place} \
                onEdit={onEditPlace} \
                onDelete={onDeletePlace} \
              />\
            ))}\
            {country.places.length === 0 && (\
              <div className="text-center py-6 text-sm text-text-muted border border-dashed border-border rounded-xl">\
                No places added yet.\
              </div>\
            )}\
          </div>\
        </div>\
      </div>\
' src/features/home/presentation/components/CountryAccordion.tsx
