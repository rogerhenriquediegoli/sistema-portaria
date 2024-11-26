package com.seuprojeto.carmanagement.controller;

import com.seuprojeto.carmanagement.model.Carro;
import com.seuprojeto.carmanagement.service.CarroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/carros")
public class CarroController {

    @Autowired
    private CarroService carroService;

    @GetMapping
    public List<Carro> getAllCarros() {
        return carroService.getAllCarros();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carro> getCarroById(@PathVariable Long id) {
        Optional<Carro> carro = carroService.getCarroById(id);
        return carro.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carro> updateCarro(@PathVariable Long id, @RequestBody Carro carro) {
        carro.setIdCarro(id);  // Atribuindo o ID da URL ao corpo da requisição
        try {
            Carro updatedCarro = carroService.updateCarro(id, carro);
            return ResponseEntity.ok(updatedCarro);
        } catch (IllegalArgumentException e) {
            // Retorna a mensagem de erro com um status 400 e o erro no corpo
            return ResponseEntity.badRequest().body(new Carro());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarro(@PathVariable Long id) {
        carroService.deleteCarro(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para contar carros por status
    @GetMapping("/count-status")
    public ResponseEntity<String> getCarrosCountByStatus() {
        String countByStatus = carroService.getCarrosCountByStatus();
        return ResponseEntity.ok(countByStatus);
    }

    @PostMapping
    public ResponseEntity<?> createCarro(@RequestBody Carro carro) {
        try {
            Carro createdCarro = carroService.createCarro(carro);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCarro);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Erro ao cadastrar carro."));
        }
    }

    /**
     * Endpoint para alterar o status do carro para "Disponível".
     * Permite também atualizar a quilometragem e o nível de combustível.
     *
     * @param carroId ID do carro
     * @param novoNivelCombustivel Novo nível de combustível (opcional)
     * @param novaQuilometragem Nova quilometragem (opcional)
     * @return ResponseEntity com status da operação
     */
    @PutMapping("/{carroId}/disponivel")
    public ResponseEntity<String> alterarStatusParaDisponivel(
            @PathVariable Long carroId,
            @RequestParam(required = false) Double novoNivelCombustivel,
            @RequestParam(required = false) Integer novaQuilometragem) {

        try {
            // Chama o serviço para alterar o status do carro
            carroService.alterarStatusParaDisponivel(carroId, novoNivelCombustivel, novaQuilometragem);
            return ResponseEntity.ok("Status do carro alterado para 'Disponível' com sucesso.");
        } catch (IllegalArgumentException e) {
            // Em caso de erro, retorna um erro 400 (Bad Request) com a mensagem
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
